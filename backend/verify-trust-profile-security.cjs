require("dotenv").config({ quiet: true });

const assert = require("node:assert/strict");
const { randomUUID } = require("node:crypto");
const { PrismaClient, BusinessType, EvidenceType } = require("@prisma/client");
const { requireSupabaseAuth } = require("./src/middlewares/auth.middleware");
const { getMyProfile, updateMyProfile, requestEvidenceConfirmation } = require("./src/controllers/profile.controller");
const { confirmRequest, getConfirmation } = require("./src/controllers/confirmation.controller");
const { getPublicProfile } = require("./src/controllers/public-profile.controller");
const profileRouter = require("./src/routes/profile.route").default;
const confirmationRouter = require("./src/routes/confirmation.route").default;
const publicProfileRouter = require("./src/routes/public-profile.route").default;

const db = new PrismaClient();
const runId = randomUUID();
const userA = `security-user-a-${runId}`;
const userB = `security-user-b-${runId}`;
const profileIds = [];
const evidenceIds = [];
let failed = false;

function responseRecorder() {
  return {
    statusCode: 200,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

async function invoke(handler, request) {
  const response = responseRecorder();
  await handler(request, response);
  return response;
}

function assertProtectedRoute(router, method, path) {
  const routeLayer = router.stack.find((layer) => layer.route?.path === path && layer.route.methods[method]);
  assert.ok(routeLayer, `Missing ${method.toUpperCase()} ${path} route`);
  assert.ok(routeLayer.route.stack.some((layer) => layer.handle === requireSupabaseAuth), `${method.toUpperCase()} ${path} must require Supabase auth`);
}

async function run() {
  try {
    for (const [method, path] of [
      ["post", "/onboard"],
      ["get", "/me"],
      ["patch", "/me"],
      ["post", "/me/evidence"],
      ["get", "/me/evidence"],
      ["post", "/me/evidence/:evidenceId/confirmation-request"],
    ]) {
      assertProtectedRoute(profileRouter, method, path);
    }

    for (const router of [confirmationRouter, publicProfileRouter]) {
      for (const layer of router.stack.filter((candidate) => candidate.route)) {
        assert.ok(!layer.route.stack.some((handler) => handler.handle === requireSupabaseAuth), "Public routes must not require owner authentication");
      }
    }

    const unauthenticated = await invoke(requireSupabaseAuth, { headers: {} });
    assert.equal(unauthenticated.statusCode, 401, "Missing bearer token must be rejected");

    const profileA = await db.businessProfile.create({
      data: {
        supabaseUserId: userA,
        publicSlug: `security-a-${runId}`,
        businessName: "Security Test A",
        businessType: BusinessType.VENDOR,
      },
    });
    profileIds.push(profileA.id);

    const profileB = await db.businessProfile.create({
      data: {
        supabaseUserId: userB,
        publicSlug: `security-b-${runId}`,
        businessName: "Security Test B",
        businessType: BusinessType.FREELANCER,
      },
    });
    profileIds.push(profileB.id);

    const evidenceA = await db.evidence.create({
      data: {
        businessProfileId: profileA.id,
        title: "Customer-confirmable work",
        evidenceType: EvidenceType.ORDER,
        completedDate: new Date("2026-09-20T00:00:00Z"),
        customerName: "Private Customer",
      },
    });
    evidenceIds.push(evidenceA.id);

    const evidenceB = await db.evidence.create({
      data: {
        businessProfileId: profileB.id,
        title: "Another owner's private work",
        evidenceType: EvidenceType.SERVICE,
        completedDate: new Date("2026-09-21T00:00:00Z"),
      },
    });
    evidenceIds.push(evidenceB.id);

    const myProfile = await invoke(getMyProfile, { user: { id: userA }, params: {}, body: {} });
    assert.equal(myProfile.statusCode, 200);
    assert.equal(myProfile.body.data.id, profileA.id, "Profile lookup must use only authenticated user identity");
    assert.ok(!JSON.stringify(myProfile.body).includes(userA), "Owner ID must not be returned");

    const tamperedUpdate = await invoke(updateMyProfile, {
      user: { id: userA },
      params: {},
      body: { businessName: "Updated A", profileId: profileB.id, supabaseUserId: userB },
    });
    assert.equal(tamperedUpdate.statusCode, 200);
    assert.equal(tamperedUpdate.body.data.id, profileA.id, "A profile ID in the body must not redirect the update");
    assert.equal((await db.businessProfile.findUnique({ where: { id: profileB.id } })).businessName, "Security Test B", "Another owner's profile must remain unchanged");

    const crossOwnerConfirmation = await invoke(requestEvidenceConfirmation, {
      user: { id: userA },
      params: { evidenceId: evidenceB.id },
      body: {},
    });
    assert.equal(crossOwnerConfirmation.statusCode, 404, "A caller must not request confirmation for another owner's evidence");
    assert.equal(await db.confirmationRequest.count({ where: { evidenceId: evidenceB.id } }), 0, "No token must be issued for another owner's evidence");

    const pendingRequest = await db.confirmationRequest.create({
      data: { evidenceId: evidenceA.id, token: randomUUID() + randomUUID(), expiresAt: new Date(Date.now() + 60_000) },
    });
    const publicConfirmation = await invoke(getConfirmation, { params: { token: pendingRequest.token }, body: {} });
    assert.equal(publicConfirmation.statusCode, 200);
    assert.ok(!JSON.stringify(publicConfirmation.body).includes(userA));
    assert.ok(!JSON.stringify(publicConfirmation.body).includes("Private Customer"));
    assert.ok(!JSON.stringify(publicConfirmation.body).includes(pendingRequest.token));

    const firstConfirm = await invoke(confirmRequest, { params: { token: pendingRequest.token }, body: { confirmerName: "Confirmer" } });
    assert.equal(firstConfirm.statusCode, 200);
    const reusedConfirm = await invoke(confirmRequest, { params: { token: pendingRequest.token }, body: {} });
    assert.equal(reusedConfirm.statusCode, 409, "A confirmed token must not be reusable");
    assert.equal((await db.evidence.findUnique({ where: { id: evidenceA.id } })).verificationStatus, "CUSTOMER_CONFIRMED");

    const expiringEvidence = await db.evidence.create({
      data: {
        businessProfileId: profileA.id,
        title: "Expiring work",
        evidenceType: EvidenceType.PROJECT,
        completedDate: new Date("2026-09-22T00:00:00Z"),
      },
    });
    evidenceIds.push(expiringEvidence.id);
    const expiredRequest = await db.confirmationRequest.create({
      data: { evidenceId: expiringEvidence.id, token: randomUUID() + randomUUID(), expiresAt: new Date(Date.now() - 1000) },
    });
    assert.equal((await invoke(getConfirmation, { params: { token: expiredRequest.token }, body: {} })).statusCode, 410);
    assert.equal((await invoke(confirmRequest, { params: { token: expiredRequest.token }, body: {} })).statusCode, 410);
    assert.equal((await db.confirmationRequest.findUnique({ where: { id: expiredRequest.id } })).state, "EXPIRED");

    const publicProfile = await invoke(getPublicProfile, { params: { slug: profileA.publicSlug }, body: {} });
    assert.equal(publicProfile.statusCode, 200);
    assert.equal(publicProfile.body.data.evidence.length, 1, "Public profile must omit self-reported evidence");
    assert.ok(!JSON.stringify(publicProfile.body).includes(userA));
    assert.ok(!JSON.stringify(publicProfile.body).includes("Private Customer"));
    assert.ok(!JSON.stringify(publicProfile.body).includes(pendingRequest.token));

    console.log("PASS: Unit 12 auth-route, profile/evidence ownership, expired/reused token, and public-data checks.");
  } catch (error) {
    failed = true;
    console.error(`FAIL: ${error.message}`);
  } finally {
    if (evidenceIds.length) {
      await db.confirmationRequest.deleteMany({ where: { evidenceId: { in: evidenceIds } } });
      await db.evidence.deleteMany({ where: { id: { in: evidenceIds } } });
    }
    if (profileIds.length) await db.businessProfile.deleteMany({ where: { id: { in: profileIds } } });
    await db.$disconnect();
  }

  if (failed) process.exit(1);
  process.exit(0);
}

run();