
import networkConfig from '../config/network';
import { ethers } from 'ethers';
import { Signer } from 'ethers';

interface PeerContractOptions {
    networks: any[];
    signer: ethers.Signer;
}


export async function estimateSendFees(dstEid: any, amountToSend: any, isBase: boolean, encodedOptions: string, signer: ethers.Signer) {
    const network = networkConfig.mainnet.base;
    const whaleERC20Contract = new ethers.Contract(
        network.oftAddress,
        require('../abi/WhaleTokens.json'),
        signer
    );

    const currentBalance = await whaleERC20Contract.balanceOf(await signer.getAddress());
    console.log(`Current token balance: ${ethers.formatUnits(currentBalance, 18)}`);

    const approvalAmount = ethers.parseUnits(amountToSend, 18); // 18 decimals for most ERC-20 tokens
    
    const approveTx = await whaleERC20Contract.approve(network.adapterAddress, approvalAmount);
    await approveTx.wait();

    const _sendParam = {
        dstEid: dstEid,
        to: ethers.zeroPadValue(await signer.getAddress(), 32),
        amountLD: approvalAmount,
        minAmountLD: approvalAmount,
        extraOptions: encodedOptions,
        composeMsg: ethers.toUtf8Bytes(""),
        oftCmd: ethers.toUtf8Bytes("")
    };

    try {
        const adapterContract = new ethers.Contract(
            network.adapterAddress,
            require('../contracts/WhaleAdapter.json').abi,
            signer
        );
        const feeEstimate = await adapterContract.quoteSend(_sendParam, false);

        console.log(`Estimated fees: ${ethers.formatUnits(feeEstimate.nativeFee, "ether")} ETH, ${ethers.formatUnits(feeEstimate.lzTokenFee, 18)} LZT`);
        // Return the estimated fees
        return {
          nativeFee: feeEstimate.nativeFee,
          lzTokenFee: feeEstimate.lzTokenFee,
      };
    } catch (error) {
        console.error(`Error estimating fees: ${error}`);
    }
}


export async function sendTokensToDestination({
  amountToSend,
  msgFee,
  encodedOptions,
  signer,
  destinationOftAddress,
  sourceAdapterAddress,
  DESTINATION_ENDPOINT_ID,
}: SendTokensParams): Promise<ethers.TransactionReceipt | void> {
  try {
    // Validate input parameters
    if (!amountToSend || parseFloat(amountToSend.toString()) <= 0) {
      throw new Error("Invalid or zero amount to send specified.");
    }
    if (!ethers.isAddress(destinationOftAddress)) {
      throw new Error("Invalid OFT address specified.");
    }

    // Parse the amount to the correct unit
    const approvalAmount = ethers.parseUnits(amountToSend.toString(), 18);

    // Prepare the send parameters
    const sendParam = {
      dstEid: DESTINATION_ENDPOINT_ID,
      to: ethers.zeroPadValue(await signer.getAddress(), 32),
      amountLD: approvalAmount,
      minAmountLD: approvalAmount,
      extraOptions: encodedOptions,
      composeMsg: ethers.toUtf8Bytes(""),
      oftCmd: ethers.toUtf8Bytes("")
    };

    console.log(`Sending ${amountToSend} tokens from ${sourceAdapterAddress}`);

    const adapterContract = new ethers.Contract(
      sourceAdapterAddress,
      require('../contracts/WhaleAdapter.json').abi,
      signer
  );

  const signerAddress = await signer.getAddress();


    // Log the user's balance before sending tokens
    const balanceBefore = await signer.provider?.getBalance(signerAddress);
    console.log(`Balance before transaction: ${ethers.formatUnits(balanceBefore!, "ether")} ETH`);
    
       // Estimate gas
       const gasEstimate = await adapterContract.estimateGas.send(
        sendParam,
        msgFee,
        await signer.getAddress(),
        { value: msgFee.nativeFee }
      );
      console.log(`Estimated Gas: ${gasEstimate.toString()}`);
  
      const gasLimitWithBuffer = BigInt(gasEstimate.toString()) + BigInt(10000);

      
    
    // Sending tokens, passing msgFee as transaction options
    const txResponse = await adapterContract.send(
      sendParam,
      msgFee,
      signerAddress,
      {
        value: msgFee.nativeFee, // Ensure to pass the payable amount if required                
      }
    );

    console.log(`Transaction Hash: ${txResponse.hash}`);

    // Wait for the transaction to be mined
    const receipt = await txResponse.wait();
    console.log(`Transaction confirmed in block: ${receipt.blockNumber}`);

    // Log the user's balance after sending tokens
    const balanceAfter = await signer.provider?.getBalance(signerAddress);
    console.log(`Balance after transaction: ${ethers.formatUnits(balanceAfter!, "ether")} ETH`);


    return receipt; // Returning the receipt might be useful for further processing

  } catch (error) {
    // Log detailed error message and rethrow or handle appropriately
    console.error('Failed to send tokens:', error);
    throw error; // Rethrowing the error is useful if you want calling functions to handle it
  }
}


interface SendTokensParams {
  amountToSend: string;
  msgFee: { nativeFee: bigint, lzTokenFee: bigint }; // Adjust types as per your needs
  encodedOptions: string;
  signer: ethers.Signer;
  destinationOftAddress: string;
  sourceAdapterAddress: string;
  DESTINATION_ENDPOINT_ID: string;
}