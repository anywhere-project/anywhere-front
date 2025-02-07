import React, { ChangeEvent } from 'react'
import './style.css';

interface Props {
    label: string;
    type: 'text' | 'password';
    placeholder: string;
    value: string;
    message: string;
    messageError: boolean;
    buttonName?: string;

    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onButtonClick?: () => void;
}

export default function InputBox({ label, type, placeholder, value, message, messageError, buttonName, onChange, onButtonClick }: Props) {
    return (
        <div id='input-box'>
            <div className='input-box'>
                <div className='label'>{label}</div>
                <div className='input-area'>
                    <input value={value} type={type} placeholder={placeholder} onChange={onChange} />
                    {buttonName && <button className='button' onClick={onButtonClick}>{buttonName}</button>}
                </div>
                <div className={`message ${messageError ? 'error' : ''}`}>{message}</div>
            </div>
        </div>
    )
}
