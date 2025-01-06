import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "./button";

export function Footer() {
  const CONTRACT_ADDRESS = "0x000"; // Updated contract address
  const DEVELOPER_WALLET = "0x000";
  const [copiedWallet, setCopiedWallet] = useState(false);
  const [copiedContract, setCopiedContract] = useState(false);

  const handleCopy = async (text: string, setCopied: (value: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <footer className="border-t">
      <div className="container mx-auto p-4">
        <div className="flex flex-col gap-4 text-sm text-muted-foreground">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span>Token Contract (Solana):</span>
              <div className="flex items-center gap-2 flex-1">
                <code 
                  onClick={() => handleCopy(CONTRACT_ADDRESS, setCopiedContract)}
                  className="bg-muted px-2 py-1 rounded text-xs flex-1 cursor-pointer hover:bg-muted/80 transition-colors"
                >
                  {CONTRACT_ADDRESS}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleCopy(CONTRACT_ADDRESS, setCopiedContract)}
                >
                  {copiedContract ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span>Support the Developer:</span>
              <div className="flex items-center gap-2 flex-1">
                <code 
                  onClick={() => handleCopy(DEVELOPER_WALLET, setCopiedWallet)}
                  className="bg-muted px-2 py-1 rounded text-xs flex-1 cursor-pointer hover:bg-muted/80 transition-colors"
                >
                  {DEVELOPER_WALLET}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleCopy(DEVELOPER_WALLET, setCopiedWallet)}
                >
                  {copiedWallet ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}