import styles from "./styles.module.css";
import React, { ChangeEvent } from "react";

import { IoPersonSharp } from "react-icons/io5";

import { TextInput, SelectInput, ImageInput } from "@/components/FormInput/InputComponent";
import useAddress from "@/utils/hooks/useAddress";
import { CityType } from "@/utils/types/User";
import { FaRegTrashAlt } from "react-icons/fa";

export default function UserForm({
    username,
    values,
    disabled,
    address,
    setFieldValue,
    onDelete = false,
}: {
    username: string;
    values: any;
    disabled: boolean;
    address: CityType[];
    setFieldValue: any;
    onDelete?: false | (() => void);
}) {
    const {
        citiesList,
        districtsList,
        wardsList,
        handleUpdateLocation,
        reset: resetAddress,
    } = useAddress(address, values);

    return (
        <div className={`${styles.formGroup}`}>
            <div className={`${styles.formGroupHeader}`}>
                <div>
                    <p>
                        <IoPersonSharp className={styles.iconStyle} /> {username.replace(/([A-Z])/g, " $1")}
                    </p>
                    {onDelete && (
                        <button type="button" onClick={onDelete}>
                            <FaRegTrashAlt className={styles.iconStyle} />
                        </button>
                    )}
                </div>

                <hr className={styles.horizontalDivider} />
            </div>

            <div className={styles.formRow}>
                <div className={styles.left}>
                    <ImageInput label="Driver License" name={`${username}.drivingLicense"`} />
                </div>
                <div className={styles.right}>
                    <div className={`${styles.formGrid} ${styles.formGridOdd}`}>
                        <TextInput name={`${username}.email`} label="Email address" type="email" readOnly={true} />
                        <TextInput name={`${username}.name`} label="Full Name" readOnly={disabled} />
                        <TextInput name={`${username}.phone`} label="Phone Number" type="phone" readOnly={disabled} />
                        <TextInput
                            name={`${username}.dateOfBirth`}
                            label="Date of birth"
                            type="date"
                            readOnly={disabled}
                        />
                        <TextInput name={`${username}.nationalID`} label="National ID No" readOnly={disabled} />
                    </div>

                    <div className={styles.formGrid}>
                        <SelectInput
                            name={`${username}.address.city`}
                            label="City"
                            value={values.address.city}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                handleUpdateLocation(e, setFieldValue, `${username}.address.city`);
                            }}
                            placeholder="-- Select City --"
                            options={citiesList}
                            readOnly={disabled}
                        />
                        <SelectInput
                            name={`${username}.address.district`}
                            label="District"
                            value={values.address.district}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                handleUpdateLocation(e, setFieldValue, `${username}.address.district`);
                            }}
                            placeholder="-- Select District --"
                            options={districtsList}
                            readOnly={disabled}
                        />
                        <SelectInput
                            name={`${username}.address.ward`}
                            label="Ward"
                            value={values.address.ward}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                handleUpdateLocation(e, setFieldValue, `${username}.address.ward`);
                            }}
                            placeholder="-- Select Ward --"
                            options={wardsList}
                            readOnly={disabled}
                        />
                        <TextInput
                            name={`${username}.address.houseNumberStreet`}
                            label="House number, Street"
                            readOnly={disabled}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
