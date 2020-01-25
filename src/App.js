import React from 'react';
import axios from 'axios';
// import cities from './city.list.json';

export default class App extends React.Component {
  constructor() {
    super();

    this.state = {
      city: '',
      API_KEY: '10fdb9377ecec456103c045bc8c7a376',
      forecast: []
    };

    this.showForecast = this.showForecast.bind(this);
  }

  showForecast() {
    axios
      .get(
        `http://api.openweathermap.org/data/2.5/forecast?q=${this.state.city}&APPID=${this.state.API_KEY}`
      )
      .then(res => this.setState({ forecast: res.data.list }));
  }

  render() {
    return (
      <div>
        <input
          onChange={e => this.setState({ city: e.target.value })}
          value={this.state.city}
        />
        <button onClick={() => this.showForecast()}>Show forecast</button>
        {this.state.forecast.map(day => (
          <div>
            <h4>{day.dt_txt}</h4>
            <p>{day.clouds.all}</p>
            <p>{day.main.feels_like}</p>
          </div>
        ))}
      </div>
    );
  }
}
