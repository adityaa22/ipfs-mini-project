import { useState } from "react"
import axios from 'axios'
import GenerateCarReceipt from "../Transaction/GenerateCarReceipt"
const AddCar = () => {
    const [cid,setCid] = useState("")
    const [carDetails, setCarDetails] = useState({
        OwnerID: "",
        Model: "",
        Price: "",
        PrivateKey: ""
    })
    const submit = async () => {
        document.getElementById('form').classList.add('hidden')
        document.getElementById('loader').classList.remove('hidden')
        if (carDetails.OwnerID === "" || carDetails.Model === "" || carDetails.Price === "" || carDetails.PrivateKey === "") {
            alert("Please Fill all the fields correctly before submitting")
            return
        }
        const carInfo = {
            carName: carDetails.Model,
            price: carDetails.Price
        }

        const receipt = await GenerateCarReceipt(carDetails.PrivateKey, carInfo, carDetails.OwnerID)
        console.log(receipt)
        const transactionObject = {
            OwnerID: carDetails.OwnerID,
            receipt: receipt
        }
        axios.post(`${process.env.REACT_APP_SERVER}/addcar`, transactionObject).then((res) => {
            setCid(res.data.cid)
            document.getElementById('loader').classList.add('hidden')
            document.getElementById('result').classList.remove('hidden')
            setCarDetails({
                OwnerID: "",
                Model: "",
                Price: "",
                PrivateKey: ""
            })
        })
    }
    const handleChange = (e) => {
        const { name, value } = e.target
        setCarDetails({
            ...carDetails,
            [name]: value
        })
    }
    return (
        <>
            <div id="result" className="hidden w-[80%] h-40 flex bg-white p-10 shadow-md rounded-xl flex-col items-center justify-center">
                <h3 className="font-bold text-lg mb-2">Your Car was Added Successfully</h3>
                <div className="flex flex-row mb-5 gap-2">
                    <p className="font-bold text-lg">Transaction ID: </p>
                    <p className="text-lg"> {cid}</p>
                </div>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={() => {
                    document.getElementById('result').classList.add('hidden')
                    document.getElementById('form').classList.remove('hidden')
                }}>
                    Ok
                </button>
            </div>
            <div id="loader" className="hidden flex flex-col justify-center items-center bg-white p-10 shadow-md rounded-xl relative">
                <svg className="w-12 h-12 animate-spin text-indigo-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4.75V6.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M17.1266 6.87347L16.0659 7.93413" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M19.25 12L17.75 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M17.1266 17.1265L16.0659 16.0659" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M12 17.75V19.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M7.9342 16.0659L6.87354 17.1265" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M6.25 12L4.75 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M7.9342 7.93413L6.87354 6.87347" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
                <span className="text-center">

                processing...
                </span>
            </div>
            <div id = "form" className="w-full max-w-xs">
                <h3 className="font-bold text-center mb-5 text-2xl">
                    Add a Car
                </h3>
                <form  className="bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Owner ID
                        </label>
                        <input name="OwnerID" value={carDetails.OwnerID} onChange = {handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Owner ID" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Car Model
                        </label>
                        <input name="Model" value={carDetails.Model} onChange = {handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Model Name" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Car Price
                        </label>
                        <input name="Price" value={carDetails.Price} onChange = {handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Price in wei" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Private Key
                        </label>
                        <input name="PrivateKey" value = {carDetails.PrivateKey} onChange = {handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" type= "text" placeholder = "Private Key" />
                    </div>
                    <div className="flex items-center justify-center">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={submit}>
                            Add Car
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default AddCar