import React ,{useState} from "react";
import axios from "axios";
import {ThreeDots} from "react-loader-spinner";

import "./Search.css";


export default function Search(){
    let [loading , setLoading]=useState(false);
    let [searchedCity, setSearchedCity]=useState("");
    let [forecast, setForecast]=useState([]);
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

    function weeklyForecast(response){
    if (response.data.forecast && response.data.forecast.forecastday) {
        setForecast(response.data.forecast.forecastday);
    } else {
        console.error("Forecast data not available", response.data);
        setForecast([]); // prevents crash
    }
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
        event.preventDefault();
        if(!location)return;

        setLoading(true);
        

        let apiKey="7524fc5d6f2f47dbb82140200251711";
        let apiUrl=`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=7`;
        axios.get(apiUrl).then(response =>{console.log(response.data); showWeather(response);weeklyForecast(response); setLoading(false); });
    }

    function updateLocation(event){
        setLocation(event.target.value);

    }

    return(
        
        <div className="Search">
            <form onSubmit={handleSubmit}>
                <input type="search" placeholder="Search for a city" className="city"  autoFocus onChange={updateLocation}/>
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
            {forecast.length >0 &&(
                <div className="forecast">
                    {forecast.slice(0,6).map((day,index) => {
                        let date = new Date(day.date);
                        let weekdays=date.toLocaleDateString("en-US",{weekday: "short" });

                        return(
                            <div className="forecast-day" key={index}>
                                <div className="weekday">{weekdays}</div>
                                <img src={`https:${day.day.condition.icon}`} alt={day.day.condition.text} className="forecast-icon"/>
                                <div className="forecast-temp">
                                    <strong>{Math.round(day.day.maxtemp_c)}°</strong>{""}
                                    {Math.round(day.day.mintemp_c)}°
                                </div>
                            </div>
                        );

                    })}
                </div>
            )}
        </div>
      
    )

}