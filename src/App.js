import React from 'react';
import axios from 'axios';
import {
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress
} from '@material-ui/core';
import {
  BubbleChartOutlined,
  ArrowDownward,
  CloudOutlined,
  Speed,
  Check,
  ErrorOutline
} from '@material-ui/icons/';

// User Components
import DetailCard from './components/DetailCard';
import { green } from '@material-ui/core/colors';

export default class App extends React.Component {
  constructor() {
    super();

    this.state = {
      city: 'Lviv',
      API_KEY: 'fc932c67434613e809c47f3c64d28601',
      forecast: [],
      loading: true,
      errors: []
    };

    this.showForecast = this.showForecast.bind(this);
  }

  componentDidMount() {
    this.showForecast(null);
  }

  showForecast(e) {
    e && e.preventDefault();
    this.setState({ loading: true });
    axios
      .get(
        `http://api.openweathermap.org/data/2.5/forecast?q=${this.state.city}&units=metric&&APPID=${this.state.API_KEY}`
      )
      .then(res =>
        this.setState({ forecast: res.data.list, loading: false, errors: [] })
      )
      .catch(error => {
        this.setState({ errors: [error.response.data], loading: false });
      });
  }

  render() {
    const { forecast, errors, loading } = this.state;

    return (
      <div>
        <Grid
          container
          spacing={3}
          className="forecast"
          justify="space-between"
        >
          <Grid item md={3} className="forecast__info forecast__info_main">
            {errors.length === 0 && loading === false && (
              <div>
                <img
                  src={`https://openweathermap.org/img/wn/${forecast[0].weather[0].icon}@2x.png`}
                  alt={forecast[0].weather[0].main}
                />
                <p className="forecast__weather">
                  {forecast[0].weather[0].main}
                </p>
                <p className="forecast__temp">
                  {Math.round(forecast[0].main.temp)} ℃
                </p>
                <p className="forecast__temp-detail">
                  <sub className="forecast__temp-min">
                    Min: {Math.round(forecast[0].main.temp_min)}
                  </sub>
                  <sub className="forecast__temp-max">
                    Max: {Math.round(forecast[0].main.temp_max)}
                  </sub>
                </p>
              </div>
            )}
          </Grid>

          {/* Search */}

          <Grid item md={3} className="forecast__search">
            <form onSubmit={e => this.showForecast(e)}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Changle Location"
                onChange={e => this.setState({ city: e.target.value })}
                value={this.state.city}
                error={errors.length > 0 && !loading ? true : false}
                helperText={
                  errors.length > 0 &&
                  !loading &&
                  errors[0].message[0].toUpperCase() +
                    errors[0].message.slice(1)
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={e => this.showForecast(e)}>
                        {errors.length === 0 && !loading && (
                          <Check style={{ color: green[500] }} />
                        )}
                        {errors.length > 0 && !loading && (
                          <ErrorOutline color="error" />
                        )}
                        {loading && <CircularProgress size="1em" />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </form>
          </Grid>

          <Grid item md={3} className="forecast__info forecast__info_detail">
            {errors.length === 0 && loading === false && (
              <div>
                <DetailCard
                  icon={<BubbleChartOutlined fontSize="large" />}
                  title="Humidity"
                  value={forecast[0].main.humidity + ' %'}
                />
                <DetailCard
                  icon={<ArrowDownward fontSize="large" />}
                  title="Air Pressure"
                  value={forecast[0].main.pressure + ' PS'}
                />
                <DetailCard
                  icon={<CloudOutlined fontSize="large" />}
                  title="Cloudiness"
                  value={forecast[0].clouds.all + ' %'}
                />
                <DetailCard
                  icon={<Speed fontSize="large" />}
                  title="Wind Speed"
                  value={forecast[0].wind.speed + ' km/h'}
                />
              </div>
            )}
          </Grid>
        </Grid>
      </div>
    );
  }
}
