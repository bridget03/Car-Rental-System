import styles from "./styles.module.css";
import { Field, ErrorMessage } from "formik";
import CustomImageInput from "../singularImageUpload";

export function TextInput({
    label,
    name,
    type = "text",
    required = true,
    placeholder = "",
    children,
    readOnly = false,
}: {
    label: string;
    name: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    children?: React.ReactNode;
    readOnly?: boolean;
}) {
    return (
        <div className={styles.inputGroup}>
            <label htmlFor={name} className={styles.label}>
                {label}
                {required && <sup>*</sup>}
            </label>
            <div className={styles.inputItem}>
                {type !== "phone" && (
                    <Field
                        type={type}
                        name={name}
                        className={styles.input}
                        placeholder={placeholder}
                        disabled={readOnly}
                    />
                )}

                {type === "phone" && (
                    <div className={`${styles.inputWraper}`}>
                        <span>+</span>
                        <Field type="phone" name={name} id="phone" placeholder={placeholder} disabled={readOnly} />
                    </div>
                )}
                {children && (
                    <div className={styles.iconContainer}>
                        <span className={styles.icon}>{children}</span>
                    </div>
                )}
            </div>
            <ErrorMessage name={name} component="div" className={styles.error} />
        </div>
    );
}

export function SelectInput({
    label,
    name,
    value,
    onChange,
    placeholder,
    options,
    required = true,
    readOnly = false,
}: {
    label: string;
    name: string;
    value: any;
    onChange?: any;
    placeholder?: string;
    options: any[];
    required?: boolean;
    readOnly?: boolean;
}) {
    return (
        <div className={styles.selectGroup}>
            <label className={styles.label}>
                {label}
                {required && <sup>*</sup>}
            </label>
            <div className={styles.inputItem}>
                <Field
                    className={styles.select}
                    as="select"
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={readOnly}
                >
                    <option value="" disabled defaultChecked>
                        {placeholder}
                    </option>
                    {options.map((option, index) => {
                        return (
                            <option key={index} value={option.name}>
                                {option.name}
                            </option>
                        );
                    })}
                </Field>
            </div>
            <ErrorMessage name={name} component="div" className={styles.error} />
        </div>
    );
}

export function ImageInput({ name, label }: { name: string; label: string }) {
    return (
        <div className={styles.contentGroup}>
            <label className={styles.label} htmlFor={name}>
                {label}
            </label>
            <Field name={name} component={CustomImageInput} className={styles.drivingLicense} />
            <ErrorMessage name={name} component="div" className={styles.error} />
        </div>
    );
}

export function ToggleInput({
    options,
}: {
    options: {
        name: string;
        value: string | boolean;
        label: string;
        checked: boolean;
        onClick?: () => void;
    }[];
}) {
    return (
        <div className={`${styles.toggleGroup}`}>
            {options.map((option, index) => {
                return (
                    <label className={styles.toggleInput} key={index} onClick={option.onClick}>
                        <Field type="radio" name={option.name} value={option.value} checked={option.checked} />
                        {option.label}
                    </label>
                );
            })}
        </div>
    );
}
