'use client'
import { Flex, Text, Spinner, Button, useToast, Image, Heading } from "@chakra-ui/react"

import { useState } from "react"

import { abi, contractAddress, priceWhitelist } from "@/constants"

import { whitelistAddresses } from '@/constants/tokens.js'
import { MerkleTree } from "merkletreejs"
import keccak256 from "keccak256"

import { prepareWriteContract, writeContract, waitForTransaction } from "@wagmi/core"

import { useAccount } from "wagmi"

import { parseEther } from 'viem'
import { ConnectButton } from "@rainbow-me/rainbowkit"

const WhitelistMint = () => {

  const { address, isConnected } = useAccount()
  const [isMinting, setIsMinting] = useState(false)
  const toast = useToast()

  const mint = async() => {
    // Le code qui permet de minter un nft en mode whitelist sale
    try {
      setIsMinting(true)
      let tab = [];
      console.log(whitelistAddresses)
      whitelistAddresses.map((whitelistAddress) => {
        tab.push(whitelistAddress.address)
      })
      let leaves = tab.map((address) => keccak256(address))
      let tree = new MerkleTree(leaves, keccak256, { sort: true })
      let root = tree.getHexRoot()
      let leaf = keccak256(address)
      let proof = tree.getHexProof(leaf)

      const whitelistPrice = parseEther(priceWhitelist.toString())

      const { request } = await prepareWriteContract({
        address: contractAddress,
        abi: abi,
        functionName: "mint",
        args: [1, proof],
        value: whitelistPrice
      })
      const { hash } = await writeContract(request)
      const data = await waitForTransaction({
        hash: hash
      })
      toast({
        title: 'Congratulations',
        description: "You have minted your NFT!",
        status: 'success',
        duration: 4000,
        isClosable: true,
      })
      setIsMinting(false)
    }
    catch(e) {
      console.log(e.message)
      setIsMinting(false)
      toast({
        title: 'Error',
        description: "An error occured!",
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    }
  }

  return (
    <> <ConnectButton />
      {isMinting ? (
        <Flex
          alignItems="center"
          justifyContent="center"
        >
          <Spinner />
          <Text fontSize={["1.5rem", "1.5rem", "2rem", "3rem"]}>
            Processing mint...
          </Text>
        </Flex>
      ) : (
        <Flex
            direction={['column', 'column', 'row', 'row']}
        >
            <Flex
              width={['100%', '100%', '50%', '50%']}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Heading as='h1' fontSize={['2rem', '3rem', '3rem', '4rem']}>Whitelist Sale</Heading>
              <Text mt='1rem' fontSize='2rem'>
                <Text as='span' fontWeight='bold'>Price : </Text><Text as='span' color='purple.400'>{priceWhitelist} ETH</Text> / NFT
              </Text>
              <Button mt='2rem' width='200px' colorScheme='purple' onClick={mint}>Mint</Button>
            </Flex>
            <Flex
              width={['100%', '100%', '50%', '50%']}
              alignItems="center"
              justifyContent="center"
              mt={["2rem", "2rem", "0", "0"]}
            > 
              <Image src="/blackDragon.png" alt="mint Image" width="60%" />
            </Flex>
          </Flex>
      )}
    </>
  )
}

export default WhitelistMint