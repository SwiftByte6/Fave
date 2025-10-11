
"use client";

import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";
import { useState } from "react";
import { Copy } from "lucide-react";

export default function ShareButtons({ product }) {
  const shareUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://yourstore.com/products/${product.id}`;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-3 mt-4">
      <span className="text-sm text-gray-500">Share:</span>

      <FacebookShareButton url={shareUrl} quote={product.name}>
        <FacebookIcon size={32} round />
      </FacebookShareButton>

      <TwitterShareButton url={shareUrl} title={product.name}>
        <TwitterIcon size={32} round />
      </TwitterShareButton>

      <WhatsappShareButton url={shareUrl} title={product.name}>
        <WhatsappIcon size={32} round />
      </WhatsappShareButton>

      <button
        onClick={handleCopy}
        className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 text-gray-500 hover:text-pink-600 hover:border-pink-600"
        aria-label="Copy product link"
      >
        <Copy size={16} />
      </button>

      {copied && (
        <span className="text-xs text-green-600 transition-all duration-200">
          Copied!
        </span>
      )}
    </div>
  );
}
