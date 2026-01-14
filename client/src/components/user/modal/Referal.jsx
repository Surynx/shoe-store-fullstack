import { useState } from 'react';
import { X, Copy, Check, Gift, Users } from 'lucide-react';

const ReferralModal = ({ isOpen, onClose, referralCode, totalReferrals }) => {

  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {

    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl ml-30 mt-10 rounded-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Referral Program</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Stats */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Referrals</p>
                <p className="text-2xl font-semibold text-gray-800">{totalReferrals}</p>
              </div>
              <div className="p-3 bg-white border shadow-sm rounded-lg">
                <Users className="w-6 h-6 text-gray-800" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Referral Code
            </label>
            <div className="flex gap-2">
              <div className="flex w-full px-4 py-2 justify-between items-center bg-gray-50 border border-gray-300 font-mono text-base font-semibold text-gray-800">
                {referralCode}
                 <button
                onClick={handleCopy}
                className="px-4 py-2 text-gray-700 cursor-pointer transition-colors flex gap-2 text-xs font-bold"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
              </div>        
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Gift className="w-5 h-5 text-gray-800" />
              How It Works
            </h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-7 h-7 bg-gray-200 text-gray-800 flex items-center justify-center font-semibold text-sm rounded-full">
                  1
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-1 text-sm">Share Your Code</h4>
                  <p className="text-sm text-gray-600">
                    Share your unique referral code with friends and family.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-7 h-7 bg-gray-200 text-gray-800 flex items-center justify-center font-semibold text-sm rounded-full">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-1 text-sm">They Sign Up</h4>
                  <p className="text-sm text-gray-600">
                    When they create an account using your code, they get ₹100 bonus credit.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-7 h-7 bg-gray-200 text-gray-800 flex items-center justify-center font-semibold text-sm rounded-full">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-1 text-sm">You Earn Rewards</h4>
                  <p className="text-sm text-gray-600">
                    You receive ₹150 in your wallet for every successful referral!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t bg-gray-50 border-gray-200">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-gray-800 text-white hover:bg-gray-800 transition-colors font-medium text-sm rounded-sm cursor-pointer"
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReferralModal;