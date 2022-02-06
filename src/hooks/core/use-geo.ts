import { watch, reactive, ref } from "vue";
import { useBaseApi } from "./use-api";
export function useGeo({
  countryQuery = {},
  stateQuery = {},
  cityQuery = {},
  defaultCountry = "",
  includeState = true,
  includeCity = true,
} = {}) {
  const _state = reactive({
    country: "",
    state: "",
    city: "",
    watch: false,
    init: true,
    stopWatch() {
      this.watch = false;
    },
    startWatch() {
      this.watch = true;
    },
  });

  const geoForm = reactive<IGeo>({
    country: "",
    _country: {},
    _state: {},
    _city: {},
    state: "",
    city: "",
    countries: [],
    states: [],
    cities: [],
    _countries: [],
    _states: [],
    _cities: [],
    phone_code: "",
    data() {
      const { country, state, city } = this;
      // const sort_name = [countryCode, stateCode].join("");
      let sort_name = "";
      if (this._state.id)
        sort_name = [this._state.country_code, this._state.iso2].join("");
      if (this._country.id && !sort_name) sort_name = this._country.iso2;
      return { country, state, city, sort_name };
    },
    async countryChange() {
      _state.stopWatch();
      const c = this.countries?.find((c) => c.name == this.country);
      _state.country = this.country;
      if (c) {
        // console.log(c);
        this.phone_code = "+" + c.phonecode;
        this._country = { ...c };
        if (includeState) await this.loadStates();
      }
      _state.startWatch();
    },
    async stateChange() {
      _state.stopWatch();
      // console.log("....@");
      _state.state = this.state;
      const s = this.states?.find((s) => s.name == this.state);
      if (s) {
        this._state = { ...s };
        if (includeCity) await this.loadCities();
      }
      _state.startWatch();
    },
    async cityChange() {
      _state.stopWatch();
      _state.city = this.city;
      const c = this.cities?.find(
        (s) => (includeState ? s.name : s.name_str) == this.city
      );
      if (c) {
        this.city = { ...c };
      }
      _state.startWatch();
    },
    async loadStates() {
      if (this._country?.id) {
        const { items } = await api.index(
          {
            country_id: this._country.id,
            ...stateQuery,
          },
          {
            // deepCache:true
          }
        );
        this.states = items ?? [];
        this._states = this.states.map((s) => s.name);
      }
    },
    loadCities() {
      if (this._country?.id || this._state.id) {
        const q: any = {
          country_id: this._country.id,
          state_id: this._state.id,
          ...cityQuery,
        };
        // console.log(q);
        if (!includeState) {
          q.cities = true;
        } else {
          if (this._city.id) q.city_id = this._city.id;
        }

        api
          .index({
            ...q,
          })
          .then((_data) => {
            // console.log(_data);
            this.cities = _data.items ?? [];
            this._cities = this.cities.map((c) => c.name);
          });
      }
    },
    async init({ country = "", state = "", city = "" } = {}) {
      _state.init = true;
      const response = await api.index({ ...countryQuery });
      const { items } = response;
      // console.log(response);
      //.then((_data) => {
      this.countries = items ?? [];
      this._countries = this.countries.map((c) => c.name);
      this.country = country;
      this.state = state;
      this.city = city;
      await this.countryChange();
      await this.stateChange();
      await this.cityChange();
      _state.init = false;
    },
    dataChange() {
      if (_state.init) return;
      if (_state.watch) {
        // console.log([
        //   geoForm.country != _state.country,
        //   geoForm.state != _state.state,
        //   geoForm.city != _state.city,
        // ]);

        if (geoForm.country != _state.country) geoForm.countryChange();
        if (geoForm.state != _state.state) geoForm.stateChange();
        if (geoForm.city != _state.city) geoForm.cityChange();
      }
    },
  });
  const api = useBaseApi(
    "geo",
    {},
    {
      deepCache: true,
    }
  );
  return geoForm;
}

interface IState {
  name?;
  id?;
  country_id?;
  iso2?;
  country_code?;
}
interface ICity {
  name?;
  id?;
  name_str?;
  country_code?;
  state_code?;
}
interface ICountry {
  name?;
  id?;
  phonecode?;
  iso2?;
}
export interface IGeo {
  dataChange();
  country;
  phone_code: string;
  state;
  city;
  _country: ICountry;
  _state: IState;
  _city: ICity;
  countries: ICountry[];
  states: IState[];
  cities: ICity[];
  _countries: string[];
  _states: string[];
  _cities: string[];
  data();
  countryChange();
  stateChange();
  loadCities();
  cityChange();
  loadStates();
  init(data: { country?: any; state?: any; city?: any });
}
