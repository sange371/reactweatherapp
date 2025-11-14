import React ,{useState} from "react";
import axios from "axios";
import {ThreeDots} from "react-loader-spinner";

import "./Search.css";


export default function Search(){
    let [loading , setLoading]=useState(false);
    let [searchedCity, setSearchedCity]=useState("");
    let [location, setLocation]=useState("");
    let [temperature, setTemperature]=useState(null);
    let [icon, setIcon]=useState(null);
    let [description, setDescription]=useState("");
    let [humidity, setHumidity]=useState(null);
    let [wind, setWind]=useState(null);
    let [timeCity, setTimeCity]=useState("");



    function showWeather(response){
        setTemperature(response.data.current.temp_c);
        setSearchedCity(response.data.location.name);
        setDescription(response.data.current.condition.text);
        setHumidity(response.data.current.humidity);
        setWind(response.data.current.wind_kph);
        setIcon(response.data.current.condition.icon);
        
        let time=realDate(response);
        setTimeCity(time);
        

    }
    function realDate(response){
        let cityTime=response.data.location.localtime;
        let now=new Date(cityTime);

        let days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        let day=days[now.getDay()];
        let hours=now.getHours().toString().padStart(2,"0");
        let minutes=now.getMinutes().toString().padStart(2,"0");

        return `${day} ${hours}:${minutes}`;
    }

    function handleSubmit(event){
        if(!location)return;
        setLoading(true);
        event.preventDefault();
        let apiKey="f14507b3be58405eac494548250411";
        let apiUrl=`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`;
        axios.get(apiUrl).then(response =>{ showWeather(response); setLoading(false); });
    }

    function updateLocation(event){
        setLocation(event.target.value);

    }

    return(
        
        <div className="Search">
            <form onSubmit={handleSubmit}>
                <input type="search" placeholder="Search for a city" className="city"  autofocus onChange={updateLocation}/>
                <input type="submit" value="Search" className="button"/>
            </form>
            {loading && (
                <div className="loader">
                    <ThreeDots color="#383738ff" height={40} width={40} />
                </div>
            )}
            <br/>
            {searchedCity && (
            <ul>
                <li className="searchCity">{searchedCity}</li>
                <li>{timeCity}</li>
                <li>{description}</li>
            </ul>
            )}


            <div className="row">
                <div className="col-6">
                    <img src={icon} alt={description}/>             
                    <span className="temperature">{Math.round(temperature)}</span>
                    <span className="unit">°C</span>
                </div>
                <div className="col-6">
                    <ul>
                        <li><strong>Humidity:</strong> {humidity}%</li>
                        <li><strong>Wind:</strong> {wind}km/h</li>
                    </ul>
                </div>
            </div>
        </div>
      
    )

}