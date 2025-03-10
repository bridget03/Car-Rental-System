import { ChangeEvent, useEffect, useMemo } from "react";
import { useState } from "react";
import { CityType, DistrictType, User, WardType } from "../types/User";

export default function useAddress(address: CityType[], userData?: User) {
    const [citiesList, setCitiesList] = useState<CityType[]>(address);
    const initalDistrictList = citiesList.find((city) => city.name === userData?.address?.city)?.districts;
    const [districtsList, setDistrictsList] = useState<DistrictType[]>(initalDistrictList || []);
    const initalWardList = districtsList.find((district) => district.name === userData?.address?.district)?.wards;
    const [wardsList, setWardsList] = useState<WardType[]>(initalWardList || []);

    const reset = () => {
        const selectedCity = citiesList.find((city) => {
            return city.name === userData?.address?.city;
        });
        const selectedDistrict = selectedCity?.districts.find((district) => {
            return district.name === userData?.address?.district;
        });
        setDistrictsList(selectedCity?.districts || []);
        setWardsList(selectedDistrict?.wards || []);
    };

    const handleUpdateLocation = (
        e: ChangeEvent<HTMLSelectElement>,
        setFieldValue: (field: string, value: any) => void,
        fieldName: string
    ) => {
        const newValue = e.target.value;
        const name = fieldName.split(".").pop();
        const path = fieldName.split(".").slice(0, -1).join(".");

        setFieldValue(`${fieldName}`, newValue);

        if (name === "city") {
            setFieldValue(`${path}.district`, "");
            setFieldValue(`${path}.ward`, "");
            const selectedCity = citiesList.find((city) => {
                return city.name === newValue;
            });
            setDistrictsList(selectedCity ? selectedCity.districts : []);
            setWardsList([]);
        }
        if (name === "district") {
            setFieldValue(`${path}.ward`, "");
            const selectedDistrict = districtsList.find((district) => {
                return district.name === newValue;
            });
            setWardsList(selectedDistrict ? selectedDistrict.wards : []);
        }
    };

    return { citiesList, districtsList, wardsList, reset, handleUpdateLocation };
}
