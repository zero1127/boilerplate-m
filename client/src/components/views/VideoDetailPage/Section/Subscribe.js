import React, {useEffect, useState} from 'react'
import Axios from "axios";

function Subscribe(props) {
    const [SubscribeNumber, setSubscribeNumber] = useState([])
    const [Subscribed, setSubscribed] = useState([]);

    useEffect(() => {
        let variable = {userTo: props.userTo}
        Axios.post('/api/subscribe/subscribeNumber', variable)
            .then(response => {
                if (response.data.success) {
                    setSubscribeNumber(response.data.subscribrNumber)
                } else {
                    alert('구독자 수 정보를 받아오지 못했습니다.')
                }
            })

        let subscribeVariable = {userTo: props.userTo, userFrom: localStorage.getItem('userId')}

        Axios.post('/api/subscribe/subscribed', subscribeVariable)
            .then(response => {
                if (response.data.success) {
                    setSubscribed(response.data.subscribed)
                } else {
                    alert('정보를 받아오지 못했습니다.')
                }
            })
    }, [])

    const onSubscribe = () => {
        let subscribeVariable = {userTo: props.userTo, userFrom: props.userFrom}

        if (Subscribed) {
            //구독중
            Axios.post('/api/subscribe/unSubscribe', subscribeVariable)
                .then(response => {
                    if (response.data.success) {
                        setSubscribeNumber(SubscribeNumber - 1)
                        setSubscribed(!Subscribed)
                    } else {
                        alert('구독취소에 실패했습니다.')
                    }
                })
        } else {
            //구독중 아님
            Axios.post('/api/subscribe/subscribe', subscribeVariable)
                .then(response => {
                    if (response.data.success) {
                        setSubscribeNumber(SubscribeNumber + 1)
                        setSubscribed(!Subscribed)
                    } else {
                        alert('구독에 실패했습니다.')
                    }
                })
        }
    }
    return (
        <div>
            <button style={{
                backgroundColor: `${Subscribed ? '#AAAAAA' : '#CC0000'}`,
                borderRadius: '4px',
                color: 'white',
                padding: '10px 16px',
                fontWeight: '500',
                fontSize: '1rem',
                textTransform: 'uppercase'
            }}
                    onClick={onSubscribe}
            >
                {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
        </div>
    )
}

export default Subscribe;
