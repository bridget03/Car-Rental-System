import React, { useEffect, useState } from "react";
import { IoLocationSharp, IoPersonSharp } from "react-icons/io5";
import styles from "./CarInfo.module.css";
import { FaBluetooth, FaUnlock, FaSun, FaChild, FaCamera, FaUsb, FaCar, FaFileContract, FaCheck } from "react-icons/fa";
import { IoDocumentSharp } from "react-icons/io5";
import { RiFunctionAddLine } from "react-icons/ri";

import { FcDvdLogo } from "react-icons/fc";
import { useRouter } from "next/router";
import { CiCircleCheck } from "react-icons/ci";
import { CarBase } from "@/utils/types/Car";

const CarInfo = ({ carData }: { carData: CarBase }) => {
    const additionalFunction = [
        { name: "Bluetooth", icon: <FaBluetooth />, checked: carData.features.bluetooth },
        { name: "GPS", icon: <FaCamera />, checked: carData.features.gps },
        { name: "Camera", icon: <FaCamera />, checked: carData.features.camera },
        { name: "Sun roof", icon: <FaSun />, checked: carData.features.sunRoof },
        { name: "Child lock", icon: <FaUnlock />, checked: carData.features.childLock },
        { name: "Child seat", icon: <FaChild />, checked: carData.features.childSeat },
        { name: "DVD", icon: <FcDvdLogo />, checked: carData.features.dvd },
        { name: "USB", icon: <FaUsb />, checked: carData.features.usb },
    ];
    const termOfUse = [
        { name: "No smoking", checked: carData.rules.noSmoking },
        { name: "No food in car", checked: carData.rules.noFood },
        { name: "No pet", checked: carData.rules.noPet },
        { name: "Other", checked: false },
    ];

    return (
        <div className={styles.container}>
            {/* Car's basic Information */}
            <div className={`${styles.formGroup}`}>
                <div className={`${styles.formGroupHeader}`}>
                    <p>
                        <IoPersonSharp className={styles.iconStyle} /> Car&apos;s basic Information
                    </p>
                    <hr className={styles.divider} />
                </div>
                <div className={`${styles.formGrid}`}>
                    <p className={styles.cell}>
                        <strong>License Plate:</strong>
                        <span>--to do--</span>
                    </p>
                    <p className={styles.cell}>
                        <strong>Brand Name:</strong>
                        <span>{carData.name}</span>
                    </p>
                    <p className={styles.cell}>
                        <strong>Production Year:</strong>
                        <span>{carData.productionYear}</span>
                    </p>
                    <p className={styles.cell}>
                        <strong>Transmission:</strong>
                        <span>{carData.transmissionType}</span>
                    </p>
                    <p className={styles.cell}>
                        <strong>Color: </strong>
                        <span>{carData.color}</span>
                    </p>
                    <p className={styles.cell}>
                        <strong>Model:</strong> <span>{carData.model}</span>
                    </p>
                    <p className={styles.cell}>
                        <strong>No Of Seats:</strong> <span>{carData.numberOfSeats}</span>
                    </p>
                    <p className={styles.cell}>
                        <strong>Fuel:</strong> <span>{carData.fuelType}</span>
                    </p>
                </div>
            </div>
            {/* Documents */}
            <div className={`${styles.formGroup}`}>
                <div className={`${styles.formGroupHeader}`}>
                    <p>
                        <IoDocumentSharp className={styles.iconStyle} /> Documents
                    </p>

                    <hr className={styles.divider} />
                </div>

                <div className={`${styles.formCol} ${styles.tableContainer}`}>
                    <table className={styles.tableDocument}>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Name</th>
                                <th>Note</th>
                                <th>Link</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Registration paper</td>
                                <td>Verified</td>
                                <td>
                                    <a href="https://res.cloudinary.com/di24e9bcc/raw/upload/v1739947232/rentcar/all/Group_02_Meeting_Minutes_14_Feb.pdf_axhmm0.pdf">
                                        chinhngu
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Centro comercial Moctezuma</td>
                                <td>Verified</td>
                                <td>Linkkk</td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>Insurance</td>
                                <td>Certificate of Inspectio</td>
                                <td>Mexico</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Car's details */}
            <div className={styles.responsiveCotainer}>
                <div className={`${styles.formGroup}`}>
                    <div className={`${styles.formGroupHeader}`}>
                        <p>
                            <FaCar className={styles.iconStyle} /> Car&apos;s details
                        </p>

                        <hr className={styles.divider} />
                    </div>

                    <div className={`${styles.formCol} `}>
                        <p className={styles.cell}>
                            <strong>Mileage:</strong>
                            <span> {carData.mileage}</span>
                        </p>
                        <p className={styles.cell}>
                            <strong>Fuel Consumption:</strong>
                            <span> {carData.fuelConsumption}</span>
                        </p>
                    </div>
                </div>
                {/* Address  */}
                <div className={`${styles.formGroup}`}>
                    <div className={`${styles.formGroupHeader}`}>
                        <p>
                            <IoLocationSharp className={styles.iconStyle} /> Address
                        </p>

                        <hr className={styles.divider} />
                    </div>

                    <div className={`${styles.formCol}`}>
                        <p className={styles.cell}>
                            <strong>Address:</strong>
                            <span>{carData.location}</span>
                        </p>
                    </div>
                </div>
            </div>
            {/* Description  */}
            <div className={`${styles.formGroup}`}>
                <div className={`${styles.formGroupHeader}`}>
                    <p>
                        <IoLocationSharp className={styles.iconStyle} /> Description
                    </p>

                    <hr className={styles.divider} />
                </div>

                <p>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla ipsa sint eius, impedit dolore
                    sapiente sit, expedita praesentium fugiat explicabo aspernatur autem iusto facere veritatis a dicta
                    soluta ipsam vitae.
                </p>
            </div>
            {/* Additional function  */}
            <div className={`${styles.formGroup}`}>
                <div className={`${styles.formGroupHeader}`}>
                    <p>
                        <RiFunctionAddLine className={styles.iconStyle} /> Additional function
                    </p>

                    <hr className={styles.divider} />
                </div>

                <div className={styles.formCol}>
                    <div role="group" aria-labelledby="checkbox-group" className={styles.checkboxGroup}>
                        {additionalFunction.map((func, index) => {
                            return (
                                <div
                                    key={index}
                                    className={`${styles.labelFunction} ${
                                        func.checked ? styles.checked : styles.unChecked
                                    }`}
                                >
                                    <p>
                                        <span className={styles.iconStyle}>{func.icon}</span>
                                        <span> {func.name}</span>
                                    </p>
                                    {func.checked && <FaCheck className={styles.checkMark} />}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            {/* Term of use */}
            <div className={`${styles.formGroup}`}>
                <div className={`${styles.formGroupHeader}`}>
                    <p>
                        <FaFileContract className={styles.iconStyle} /> Term of use
                    </p>

                    <hr className={styles.divider} />
                </div>

                <div className={styles.formCol}>
                    <div role="group" aria-labelledby="checkbox-group" className={styles.checkboxGroup}>
                        {termOfUse.map((term, index) => {
                            return (
                                <div
                                    key={index}
                                    className={`${styles.labelFunction} ${
                                        term.checked ? styles.checked : styles.unChecked
                                    }`}
                                >
                                    <p>
                                        <span> {term.name}</span>
                                    </p>
                                    {term.checked && <FaCheck className={styles.checkMark} />}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarInfo;
