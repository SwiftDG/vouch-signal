require("dotenv").config({ quiet: true });

const assert = require("node:assert/strict");
const { randomUUID } = require("node:crypto");
const { PrismaClient, BusinessType, EvidenceType } = require("@prisma/client");
const { requireSupabaseAuth } = require("./dist/middlewares/auth.middleware");
const { getMyProfile, getMyEvidence, updateMyProfile, requestEvidenceConfirmation } = require("./dist/controllers/profile.controller");
const { getConfirmation, respondConfirmation } = require("./dist/controllers/confirmation.controller");
const { getPublicProfile } = require("./dist/controllers/public-profile.controller");
const profileRouter = require("./dist/routes/profile.route").default;
const confirmationRouter = require("./dist/routes/confirmation.route").default;
const publicProfileRouter = require("./dist/routes/public-profile.route").default;

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
      ["post", "/me/evidence/:id/confirmation-request"],
    ]) {
      assertProtectedRoute(profileRouter, method, path);
    }

    assert.ok(confirmationRouter.stack.some((layer) => layer.route?.path === "/:token" && layer.route.methods.get), "Missing GET /:token confirmation read route");
    assert.ok(confirmationRouter.stack.some((layer) => layer.route?.path === "/:token/respond" && layer.route.methods.post), "Missing POST /:token/respond route");

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
      params: { id: evidenceB.id },
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
    assert.equal(publicConfirmation.body.data.state, "pending");

    const invalidDecision = await invoke(respondConfirmation, { params: { token: pendingRequest.token }, body: { decision: "maybe" } });
    assert.equal(invalidDecision.statusCode, 400, "Unsupported decisions must be rejected");
    const extraResponseField = await invoke(respondConfirmation, { params: { token: pendingRequest.token }, body: { decision: "confirmed", confirmerName: "Private Customer" } });
    assert.equal(extraResponseField.statusCode, 400, "Confirmation responses must accept only a decision");

    const firstConfirm = await invoke(respondConfirmation, { params: { token: pendingRequest.token }, body: { decision: "confirmed" } });
    assert.equal(firstConfirm.statusCode, 200);
    assert.equal(firstConfirm.body.data.state, "confirmed");
    const reusedConfirm = await invoke(respondConfirmation, { params: { token: pendingRequest.token }, body: { decision: "declined" } });
    assert.equal(reusedConfirm.statusCode, 409, "A confirmed token must not be reusable");
    assert.equal((await invoke(getConfirmation, { params: { token: pendingRequest.token }, body: {} })).statusCode, 409, "A used token must not load its confirmation prompt");
    assert.equal((await db.evidence.findUnique({ where: { id: evidenceA.id } })).verificationStatus, "CUSTOMER_CONFIRMED");

    const declinedEvidence = await db.evidence.create({
      data: {
        businessProfileId: profileA.id,
        title: "Declined work",
        evidenceType: EvidenceType.SERVICE,
        completedDate: new Date("2026-09-23T00:00:00Z"),
      },
    });
    evidenceIds.push(declinedEvidence.id);
    const declinedRequest = await db.confirmationRequest.create({
      data: { evidenceId: declinedEvidence.id, token: randomUUID() + randomUUID(), expiresAt: new Date(Date.now() + 60_000) },
    });
    const firstDecline = await invoke(respondConfirmation, { params: { token: declinedRequest.token }, body: { decision: "declined" } });
    assert.equal(firstDecline.statusCode, 200);
    assert.equal(firstDecline.body.data.state, "declined");
    const savedDecline = await db.confirmationRequest.findUnique({ where: { id: declinedRequest.id } });
    assert.ok(savedDecline.declinedAt, "A decline response must be timestamped");
    assert.equal((await db.evidence.findUnique({ where: { id: declinedEvidence.id } })).verificationStatus, "SELF_REPORTED");
    assert.equal((await invoke(respondConfirmation, { params: { token: declinedRequest.token }, body: { decision: "confirmed" } })).statusCode, 409, "A declined token must not be reusable");
    assert.equal((await invoke(getConfirmation, { params: { token: declinedRequest.token }, body: {} })).statusCode, 409, "A declined token must not load its confirmation prompt");
    const retryDeclined = await invoke(requestEvidenceConfirmation, { user: { id: userA }, params: { id: declinedEvidence.id }, body: {} });
    assert.equal(retryDeclined.statusCode, 409, "A declined request must not be reset");
    assert.equal((await db.confirmationRequest.findUnique({ where: { id: declinedRequest.id } })).declinedAt.getTime(), savedDecline.declinedAt.getTime(), "Decline timestamp must remain intact");
    const ownerEvidence = await invoke(getMyEvidence, { user: { id: userA }, params: {}, body: {} });
    assert.equal(ownerEvidence.statusCode, 200);
    assert.equal(ownerEvidence.body.data.find((record) => record.id === declinedEvidence.id).confirmationRequest.state, "DECLINED");
    assert.ok(!JSON.stringify(ownerEvidence.body).includes(declinedRequest.token), "Owner evidence list must not expose confirmation tokens");

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
    assert.equal((await invoke(respondConfirmation, { params: { token: expiredRequest.token }, body: { decision: "confirmed" } })).statusCode, 410);
    assert.equal((await db.confirmationRequest.findUnique({ where: { id: expiredRequest.id } })).state, "EXPIRED");

    const publicProfile = await invoke(getPublicProfile, { params: { slug: profileA.publicSlug }, body: {} });
    assert.equal(publicProfile.statusCode, 200);
    assert.equal(publicProfile.body.data.evidence.length, 1, "Public profile must omit self-reported evidence");
    assert.ok(!JSON.stringify(publicProfile.body).includes(userA));
    assert.ok(!JSON.stringify(publicProfile.body).includes("Private Customer"));
    assert.ok(!JSON.stringify(publicProfile.body).includes(pendingRequest.token));

    console.log("PASS: Auth-route, profile/evidence ownership, confirmation decisions, replay/expiry, and public-data checks.");
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
