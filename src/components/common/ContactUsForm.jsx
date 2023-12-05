import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../core/HomePage/Button'
import { apiConnector } from '../../services/apiconnector'
import { contactusEndpoint } from '../../services/apis'
function ContactUsForm() {
    const [loading,setLoading]=useState(false)
    const {
        register,
        handleSubmit,
        reset,
        formState:{errors,isSubmitSuccessful},
    }=useForm()
    const submitContactForm=async(data)=>{
            console.log(data)
            try{
                setLoading(true)
                const response=await apiConnector("POST",contactusEndpoint.CONTACT_US_API,data);
                console.log(response)
                setLoading(false)
            }
            catch(error){
                console.log(error.message)
                setLoading(false)
            }
    }
    useEffect(()=>{
        if (isSubmitSuccessful){
            reset({
                email:"",
                firstname:"",
                lastname:"",
                message:"",
                phoneNo:"",
            })
        }
    },[reset,isSubmitSuccessful])

  return (
    <div>
        <form onSubmit={handleSubmit(submitContactForm)}>
            <div className='flex flex-col'>
                {/* firstName */}
                <div>
                    <label htmlFor='firstname'>
                        <p>First Name</p>
                        <input type="text" name="firstname" id="firstname" placeholder='Enter First Name' {...register("firstname",{required:true})}></input>
                    </label>
                    {
                        errors.firstname &&(
                            <span>
                                Please Enter Your Name
                            </span>
                        )
                    }
                </div>
                <div>
                    <label htmlFor='lastname'>
                        <p>Last Name</p>
                        <input type="text" name="lastname" id="lastname" placeholder='Enter Last Name' {...register("firstname")}></input>
                    </label>
                </div>
                <div>
                    <label htmlFor='email'>
                        <p>Email</p>
                        <input type="email" name="email" id="email" placeholder='Enter Email ' {...register("email",{required:true})}></input>
                    </label>
                    {
                        errors.email &&(
                            <span>
                                Please Enter Your Email
                            </span>
                        )
                    }
                </div>
                <div>
                    <label htmlFor='message'>
                        <p>Message</p>
                        <textarea name='message' id="message" placeholder='Enter Your Message' cols="30" rows={7} {...register("message",{required:true})}></textarea>
                    </label>
                    {
                        errors.messsage &&(
                            <span>
                                Please Enter Your Message
                            </span>
                        )
                    }
                </div>

                <button type='submit'>
                    Send Message
                </button>
            </div>

        </form>

    </div>
  )
}

export default ContactUsForm