/*global kakao*/
import React, {useEffect, useState} from "react";
import {withRouter} from "react-router-dom";
import {Form, Icon, Input, Button, Checkbox, Typography, Row} from 'antd';

const {Title} = Typography;

function MapPage(props) {

    useEffect(() => {
        const script = document.createElement("script");
        script.async = true;
        script.src = "https://dapi.kakao.com/v2/maps/sdk.js?appkey=0d455f04317b2c956718714c1773580f&autoload=false";
        document.head.appendChild(script);

        script.onload = () => {
            kakao.maps.load(() => {
                let container = document.getElementById("Mymap");
                let options = {
                    center: new kakao.maps.LatLng(37.506502, 127.053617),
                    level: 7
                };
                const map = new window.kakao.maps.Map(container, options);
            });
        }

    }, []);


    return (
        <div style={{width: '85%', margin: '3rem auto'}}>
            <Title level={2}> Map Page example </Title>
            <hr/>

            {/*사이즈 정의 필요*/}
            <div id='Mymap'
                 style={{
                     width: '100%',
                     height: '300px'
                 }}/>
        </div>
    );
};

export default withRouter(MapPage);


