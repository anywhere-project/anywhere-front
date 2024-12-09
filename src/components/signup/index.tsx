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

export default function SignUpBox({ label, type, placeholder, value, message, messageError, buttonName, onChange, onButtonClick }: Props) {
    return (
        <div className='signup-form-input'>
            <label className='signup-label'>{label}</label>
            <div className='signup-input-area'>
                <input value={value} type={type} placeholder={placeholder} onChange={onChange} />
                {buttonName && <button type="button" className='signup-button' onClick={onButtonClick}>{buttonName}</button>}
            </div>
            <div className={`signup-message ${messageError ? 'error' : ''}`}>{message}</div>
        </div>
    );
}
