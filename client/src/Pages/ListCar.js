import axios from 'axios'
import { useState } from 'react'

const ListCar = () => {
    const [msg,setMsg] = useState("")
    const [transactionDetails, setTransactionDetails] = useState({
        OwnerID: "",
        TransactionID: ""
    })
    const submit = () => {
        document.getElementById('list-form').classList.add('hidden')
        document.getElementById('loader').classList.remove('hidden')
        if (transactionDetails.OwnerID === "" || transactionDetails.TransactionID === "") {
            alert("Please Fill all the fields correctly before submitting")
            return
        }
        axios.post(`${process.env.REACT_APP_SERVER}/listcar`, transactionDetails).then((res) => {
            setMsg(res.data.msg)
            document.getElementById('loader').classList.add('hidden')
            document.getElementById('result').classList.remove('hidden')
            setTransactionDetails({
                OwnerID: "",
                TransactionID: ""
            })
        })
    }
    const handleChange = (e) => {
        const { name, value } = e.target
        setTransactionDetails({
            ...transactionDetails,
            [name]: value
        })
    }
    return (
        <>
            <div id="result" className="hidden w-[80%] h-40 flex flex-col bg-white p-10 shadow-md rounded-xl flex-col items-center justify-center">
                <h3 className="font-bold text-lg mb-2">{msg}</h3>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={() => {
                    document.getElementById('result').classList.add('hidden')
                    document.getElementById('list-form').classList.remove('hidden')
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
                    Validating...
                </span>
            </div>
            <div id="list-form" className="w-full max-w-xs">
                <h3 className="font-bold text-center mb-5 text-2xl">
                    List Car for Sale
                </h3>
                <form autoComplete='off' className="bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Owner ID
                        </label>
                        <input name='OwnerID' value={transactionDetails.OwnerID} onChange = {handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Owner ID" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Car Transaction ID
                        </label>
                        <input name='TransactionID' value={transactionDetails.TransactionID} onChange = {handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Car Transaction ID" />
                    </div>
                    <div className="flex items-center justify-center">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={submit}>
                            List Car
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default ListCar