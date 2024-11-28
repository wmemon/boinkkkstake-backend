import { mintTokens } from "@/utils/mintTokens";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest): Promise<Response> {

    console.log("reaching here");
    
    interface AccountData {
        account: string;
        nativeBalanceChange: number;
      }
      
      interface HeliusTransaction {
        accountData: AccountData[];
      }      
      

    try {
      const body = (await req.json()) as HeliusTransaction[];
      
      // Check if body is an array and has at least one transaction
      if (!Array.isArray(body) || body.length === 0) {
        return Response.json(
          { 
            error: 'Invalid request body format',
            message: 'Request body must be an array with at least one transaction'
          },
          { status: 400 }
        );
      }
  
      const transaction = body[0];
      
      console.log("Transaction is: ");
      console.log(transaction)

      // Extract data from transaction with type safety
      const fromAddress = transaction.accountData?.[0]?.account;
      const toAddress = transaction.accountData?.[1]?.account;
      const amount = transaction.accountData?.[1]?.nativeBalanceChange;
  
      // Validate required data
      if (!fromAddress || !toAddress || amount === undefined) {
        return Response.json(
          { 
            error: 'Missing required transaction data',
            details: { fromAddress, toAddress, amount }
          },
          { status: 400 }
        );
      }
  
      // Process the mint operation
      const mintResult = await mintTokens(fromAddress, toAddress, amount);
  
      // Return success response
      return Response.json(
        {
          success: true,
          data: mintResult
        },
        { status: 200 }
      );
  
    } catch (error) {
      console.error('Error processing Helius webhook:', error);
      return Response.json(
        { 
          error: 'Internal server error',
          message: error instanceof Error ? error.message : 'Unknown error occurred'
        },
        { status: 500 }
      );
    }
  }
  
  // Handle other HTTP methods
  export async function GET() {
    return Response.json(
      { 
        error: 'Method not allowed',
        message: 'Only POST requests are accepted'
      },
      { status: 405 }
    );
  }