import React from 'react'
import { useNavigate } from 'react-router-dom';
import './style.css';
export default function AddNewBtn({ btnText, Icon, route, showBtn }) {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(route);
    }
    return (
        <>
            {showBtn && <div className='btn-wrapper'>
                <button onClick={handleClick}> <Icon />{btnText}</button>
            </div>}
        </>
    )
}
