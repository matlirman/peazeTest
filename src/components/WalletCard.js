import React, { useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import { ethers } from 'ethers';
const provider = ((window.ethereum != null) ? new ethers.providers.Web3Provider(window.ethereum, "any") : ethers.providers.getDefaultProvider());
console.log(provider)

// const provider = new ethers.providers.Web3Provider(window.Ethereum)

const WalletCard = () => {
    const [errorMessage, setErrorMessage] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [userBalance, setUserBalance] = useState(null);

    const [showPopup, setShowPopup] = useState(false)

    useEffect(() => {
      if(window.ethereum) {
        window.ethereum.on('chainChanged', () => {
          provider.getNetwork().then(
            networkID => {
              if (networkID.chainId !== 80001){
                window.ethereum.request({
                  method: "wallet_addEthereumChain",
                  params: [{
                    chainId: "0x13881",
                    rpcUrls: ["https://polygon-mumbai.infura.io/v3/4458cf4d1689497b9a38b1d6bbf05e78"],
                    chainName: "Matic Mumbai Testnet",
                    nativeCurrency: {
                        name: "MATIC",
                        symbol: "MATIC",
                        decimals: 18
                    },
                    blockExplorerUrls: ["https://polygonscan.com/"]
                  }]
                })
                setShowPopup(true)
              }
              else {
                setShowPopup(false)
                provider.getSigner().getBalance().then(balance => {
                  console.log(balance)
                  setUserBalance(ethers.utils.formatEther(balance));
                })
              }
            }
          )
        })
        window.ethereum.on('accountsChanged', () => {
          provider.getNetwork().then(
            networkID => {
              if (networkID.chainId !== 80001){
                window.ethereum.request({
                  method: "wallet_addEthereumChain",
                  params: [{
                    chainId: "0x13881",
                    rpcUrls: ["https://polygon-mumbai.infura.io/v3/4458cf4d1689497b9a38b1d6bbf05e78"],
                    chainName: "Matic Mumbai Testnet",
                    nativeCurrency: {
                        name: "MATIC",
                        symbol: "MATIC",
                        decimals: 18
                    },
                    blockExplorerUrls: ["https://polygonscan.com/"]
                  }]
                })
              }
              else {
                provider.getSigner().getBalance().then(balance => {
                  console.log(balance)
                  setUserBalance(ethers.utils.formatEther(balance));
                })
              }
            }
          )
        })
      }
    }, [])

    const connectwalletHandler = () => {
      if (window.ethereum) {
        provider.send("eth_requestAccounts", []).then(async () => {
          await accountChangedHandler(provider.getSigner());
        })
      } else {
        setErrorMessage("Please Install Metamask!!!");
      }
    }

    const accountChangedHandler = async (newAccount) => {
        const networkId = await provider.getNetwork();
        console.log(networkId)
        if (networkId.chainId !== 80001){
          console.log("asking to change")
          window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId: "0x13881",
              rpcUrls: ["https://polygon-mumbai.infura.io/v3/4458cf4d1689497b9a38b1d6bbf05e78"],
              chainName: "Matic Mumbai Testnet",
              nativeCurrency: {
                  name: "MATIC",
                  symbol: "MATIC",
                  decimals: 18
              },
              blockExplorerUrls: ["https://polygonscan.com/"]
            }]
          }).then(confirmation => {
            console.log("here")
            provider.getSigner().getBalance().then(balance => {
              console.log(balance)
              setUserBalance(ethers.utils.formatEther(balance));
            })
          })
        }
        console.log(newAccount)
        const address = await newAccount.getAddress();
        setDefaultAccount(address);
        const balance = await newAccount.getBalance()
        console.log(balance)
        setUserBalance(ethers.utils.formatEther(balance));
    }

    const getuserBalance = async (address) => {
        const balance = await provider.getBalance(address, "latest")
    }

    return (
        <div className="WalletCard">
            {showPopup ?
              <div>
                Please change the network to the Mumbai network in your metamask to continue
              </div>
              :
              <div></div>
            }
            <h3 className="h4">
                Welcome to a decentralized Application
            </h3>
            <Button
                style={{ background: defaultAccount ? "#A5CC82" : "white" }}
                onClick={connectwalletHandler}>
                {defaultAccount ? "Connected!!" : "Connect"}
            </Button>
            <div className="displayAccount">
                <h4 className="walletAddress">Address:{defaultAccount}</h4>
                <div className="balanceDisplay">
                    <h3>
                        Wallet Amount: {userBalance}
                    </h3>
                </div>
            </div>
            {errorMessage}
        </div>
    )
}
export default WalletCard;
