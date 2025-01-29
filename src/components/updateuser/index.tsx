import React, { ChangeEvent } from 'react'
import './style.css';

interface Props {
    label: string;
    type: 'text' | 'password';
    placeholder: string;
    value: string;
    message: string;
    messageError: boolean;
    
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function UpdateBox({ label, type, placeholder, value, message, messageError, onChange }: Props) {
    return (
        <div className='signup-form-input'>
            <label className='signup-label'>{label}</label>
            <div className='signup-input-area'>
                <input 
                    value={value} 
                    type={type} 
                    placeholder={placeholder} 
                    onChange={onChange} 
                    disabled={!value} // value가 있으면 수정할 수 없게 처리
                />
            </div>
            <div className={`signup-message ${messageError ? 'error' : ''}`}>{message}</div>
        </div>
    );
}
