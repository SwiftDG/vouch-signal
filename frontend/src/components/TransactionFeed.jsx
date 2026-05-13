import { motion, AnimatePresence } from "framer-motion";

function timeAgo(date) {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

export default function TransactionFeed({ transactions }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="relative bg-white border border-[#E8DDE0] p-8"
    >
      <div className="absolute top-0 left-0 w-1/2 h-0.5 bg-[#A84551]" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="font-['Inter'] text-xs uppercase tracking-widest text-[#8A6B70] mb-1">
            Transaction Feed
          </p>
          <p className="font-['Inter'] text-sm font-semibold text-[#1A0A0D]">
            Live Squad Payments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full bg-green-500"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="font-['Inter'] text-xs text-[#8A6B70]">Live</span>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 rounded-full bg-[#F5F0F1] flex items-center justify-center mb-4">
            <span className="text-xl">💳</span>
          </div>
          <p className="font-['Inter'] text-sm text-[#8A6B70] mb-1">
            No transactions yet
          </p>
          <p className="font-['Inter'] text-xs text-[#8A6B70] opacity-60">
            Press Shift+S to simulate payments
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          <AnimatePresence>
            {transactions.map((tx) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: 20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between p-3 bg-[#FAFAFA] border border-[#E8DDE0]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#A84551]/10 flex items-center justify-center flex-shrink-0">
                    <span className="font-['Inter'] text-xs font-bold text-[#A84551]">
                      {tx.sender.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-['Inter'] text-sm font-semibold text-[#1A0A0D]">
                      {tx.sender}
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-['Inter'] text-xs px-1.5 py-0.5 rounded ${
                          tx.isRepeat
                            ? "bg-green-50 text-green-600"
                            : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        {tx.isRepeat ? "Repeat +13pts" : "New +7pts"}
                      </span>
                      <span className="font-['Inter'] text-xs text-[#8A6B70]">
                        {timeAgo(tx.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-['Inter'] text-sm font-bold text-[#1A0A0D]">
                    ₦{tx.amount.toLocaleString()}
                  </p>
                  <p className="font-['Inter'] text-xs text-green-500">
                    ✓ Verified
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
