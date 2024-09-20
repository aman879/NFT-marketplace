import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './Mint.css';

const Mint = ({uploadToPinata, mintNFT}) => {
    const [file, setFile] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [isMinting, setIsMinting] = useState(false);

    const { getRootProps, getInputProps } = useDropzone({
        accept: { 'image/*': [] },
        onDrop: (acceptedFiles) => {
            setFile(
                Object.assign(acceptedFiles[0], {
                    preview: URL.createObjectURL(acceptedFiles[0]),
                })
            );
        },
    });

    const clearImage = () => {
        setFile(null);
    }

    const handleMint = async () => {
        if ( !file || !name || !description || !price) {
            alert('Please complete all fields');
            return;
        }

        setIsMinting(true);

        try {
            const IpfsHash = await uploadToPinata(file, name, description);
            // const uri = `https://beige-sophisticated-baboon-74.mypinata.cloud/ipfs/${IpfsHash}`;
            // // const uri = `https://beige-sophisticated-baboon-74.mypinata.cloud/ipfs/`;
            mintNFT(price, IpfsHash);
            clearImage();
        } catch (e) {
            console.log(e);
        } finally {
            setIsMinting(false);
        }
      
    };

    return (
        <div className="mint-container">
            <h2>Mint Your NFT</h2>
            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                {file ? (
                    <div>
                        <img src={file.preview} alt="Preview" className="preview-image" />
                    </div>
                ) : (
                    <p>Drag & drop an image file, or click to select one</p>
                )}
            </div>
            { file ? (
                <button 
                    className='mint-button'
                    onClick={() => clearImage()} 
                >
                    clear
                </button>
            ) : <></>}

            <div className="form-field">
                <label>Name:</label>
                <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Enter NFT Name" 
                />
            </div>

            <div className="form-field">
                <label>Description:</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter NFT Description"
                />
            </div>

            <div className="form-field">
                <label>Price (in ETH):</label>
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Enter Price in ETH"
                />
            </div>

            <button onClick={handleMint} disabled={isMinting} className='mint-button'>
                {isMinting ? 'Minting...' : 'Mint NFT'}
            </button>
        </div>
    );
};

export default Mint;
