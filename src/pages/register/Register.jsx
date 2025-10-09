import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
import api from "../../components/action/Api";
import { useToastr } from "../../components/toast/Toast";
import {
  ERROR,
  ERROR_DOUBLE_SPACE,
  ERROR_LEADING_OR_TRAILING_SPACE,
  ERROR_MAXIMUM_LENGTH,
  ERROR_MINIMUM_LENGTH,
  ERROR_MUST_LENGTH,
  ERROR_PASTE_DATA,
  ERROR_REQUIRED,
  ERROR_VALIDATE_EMAIL,
  OPPS_MSG,
  SERVER_ERROR,
  // ENTER_VALID_DATA,
  SUCCESS,
  SUCCESS_MSG,
  OPPS_ERROR,
  DOB_RANGE_MESSAGE,
  ERROR_ALL_REQUIRED
} from "../../utills/string";

import {
  sanitizeAddress,
  sanitizeEmail,
  sanitizeInput,
  sanitizeMobileNumber,
  sanitizeZipCode,
  start_with_char,
  start_with_char_or_number,
  validateDateOfBirthField,
  validateLength,
  validatePersonName,
  verifyDoubleSpace,
  verifyEmail,
  verifyPasteData,
  verifyStartingOrEndingCharacters
} from "../../utills/allValidation";

import CustomInputField from "../../components/customInput/CustomInputField";

const titleList = [
  { id: "1", name: "Mr" },
  { id: "2", name: "Mrs" },
  { id: "3", name: "Ms" }
];
const genderList = [
  { id: "1", name: "Male" },
  { id: "2", name: "Female" },
  { id: "3", name: "Other" }
];

const countryList = [
  { id: "1", name: "India" },
  { id: "2", name: "United States" },
  { id: "3", name: "Canada" },
  { id: "4", name: "Australia" }
];

const Register = () => {
  // const dispatch = useDispatch();
  const { customToast } = useToastr();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    presentAddressLine1: "",
    presentPincode: "",
    presentCountry: "1",
    presentState: "",
    presentCity: "",
    email: "",
    mobileNumber: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const mappedStates = useMemo(
    () => stateList.map((state) => ({ id: state.stateId, name: state.name })),
    [stateList]
  );

  const mappedCities = useMemo(
    () => cityList.map((city) => ({ id: city.cityId, name: city.name })),
    [cityList]
  );

  useEffect(() => {
    const fetchStatesByCountry = async () => {
      if (!formData.presentCountry) {
        setStateList([]);
        setCityList([]);
        return;
      }
      try {
        const response = await api.get(
          `/states?countryId=${formData.presentCountry}`
        );
        setStateList(response.data);
        setCityList([]);
        setFormData((prev) => ({
          ...prev,
          presentState: "",
          presentCity: ""
        }));
      } catch (e) {
        const errorMessage = e?.response?.data?.message || SERVER_ERROR;
        e.message ||
          customToast({
            severity: ERROR,
            summary: OPPS_MSG,
            detail: errorMessage,
            life: 4000
          });
      }
    };
    fetchStatesByCountry();
  }, [formData.presentCountry, customToast]);

  useEffect(() => {
    const selectedState = stateList.find(
      (state) => state.stateId.toString() === formData.presentState
    );
    if (selectedState?.cities) {
      setCityList(selectedState.cities);
    } else {
      setCityList([]);
    }
    setFormData((prev) => ({ ...prev, presentCity: "" }));
  }, [formData.presentState, stateList]);

  const selectFields = [
    "title",
    "gender",
    "presentCountry",
    "presentState",
    "presentCity"
  ];

  const handleChange = useCallback(
    (e, required = false, label = "", pastedValue = "") => {
      let { name, value } = e.target;
      if (pastedValue) value += pastedValue;

      let sanitizedValue = sanitizeInput(value);
      let updatedValue = sanitizedValue;
      let error = "";

      const skipStartCharCheckFields = [
        "dateOfBirth",
        "presentPincode",
        "mobileNumber",
        "title",
        "gender",
        "presentCountry",
        "presentState",
        "presentCity"
      ];
      const regex = skipStartCharCheckFields.includes(name)
        ? start_with_char_or_number
        : start_with_char;

      if (required && !value.trim()) {
        error = ERROR_REQUIRED(label);
      } else if (
        !skipStartCharCheckFields.includes(name) &&
        !regex.test(value)
      ) {
        error = ERROR_LEADING_OR_TRAILING_SPACE;
      }

      if (!error) {
        switch (name) {
          case "firstName":
          case "lastName":
            updatedValue = validatePersonName(sanitizedValue);
            if (updatedValue.length > 30) error = ERROR_MAXIMUM_LENGTH(30);
            break;
          case "presentAddressLine1":
            updatedValue = sanitizeAddress(sanitizedValue);
            if (updatedValue.length > 250) error = ERROR_MAXIMUM_LENGTH(250);
            break;
          case "presentPincode":
            updatedValue = sanitizeZipCode(value, 6);
            break;
          case "mobileNumber":
            updatedValue = sanitizeMobileNumber(sanitizedValue);
            break;
          case "email":
            updatedValue = sanitizeEmail(sanitizedValue);
            break;
          case "dateOfBirth":
            if (!validateDateOfBirthField(sanitizedValue)) {
              error = DOB_RANGE_MESSAGE;
            }
            break;
          default:
            break;
        }
      }

      setFormData((prev) => ({ ...prev, [name]: updatedValue }));
      setErrors((prev) => ({ ...prev, [name]: error }));

      if (name === "title") {
        setFormData((prev) => ({
          ...prev,
          gender: value === "1" ? "1" : "2"
        }));
      }
    },
    []
  );

  const handleOnBlur = useCallback((e, required, label) => {
    let { name, value } = e.target;
    let error = "";

    if (selectFields.includes(name)) {
      return;
    }

    if (!value && required) {
      error = ERROR_REQUIRED(label);
    } else {
      if (!verifyStartingOrEndingCharacters(value))
        error = ERROR_LEADING_OR_TRAILING_SPACE;
      else if (verifyDoubleSpace(value)) error = ERROR_DOUBLE_SPACE;

      switch (name) {
        case "firstName":
        case "lastName":
          if (!validateLength(value, 2, 30)) {
            error =
              value.length < 2
                ? ERROR_MINIMUM_LENGTH(2)
                : ERROR_MAXIMUM_LENGTH(30);
          }
          break;
        case "presentAddressLine1":
          if (!validateLength(value, 3, 250)) {
            error =
              value.length < 3
                ? ERROR_MINIMUM_LENGTH(3)
                : ERROR_MAXIMUM_LENGTH(250);
          }
          break;
        case "presentPincode":
          if (!validateLength(value, 6, 6)) error = ERROR_MUST_LENGTH(6);
          break;
        case "mobileNumber":
          if (!validateLength(value, 10, 10)) error = ERROR_MUST_LENGTH(10);
          break;
        case "email":
          if (!verifyEmail(value)) error = ERROR_VALIDATE_EMAIL;
          break;
        default:
          break;
      }
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  const onPaste = useCallback(
    (e, required, label) => {
      e.preventDefault();
      const name = e.target.name;
      const value = e.clipboardData.getData("Text");
      const result = verifyPasteData(value);
      if (!result.valid) {
        setErrors((prev) => ({ ...prev, [name]: ERROR_PASTE_DATA }));
        return;
      }
      handleChange(e, required, label, value);
    },
    [handleChange]
  );

  const formFields = [
    {
      label: "Title",
      id: "title",
      name: "title",
      type: "select",
      options: titleList,
      required: true,
      placeholder: "Select Title"
    },
    {
      label: "Gender",
      id: "gender",
      name: "gender",
      type: "select",
      options: genderList,
      required: true,
      placeholder: "Select Gender"
    },
    {
      label: "First Name",
      id: "firstName",
      name: "firstName",
      type: "text",
      required: true,
      placeholder: "Enter First Name"
    },
    {
      label: "Last Name",
      id: "lastName",
      name: "lastName",
      type: "text",
      required: true,
      placeholder: "Enter Last Name"
    },
    {
      label: "Date of Birth",
      id: "dateOfBirth",
      name: "dateOfBirth",
      type: "date",
      required: true,
      placeholder: "Select Date of Birth"
    },
    {
      label: "Email",
      id: "email",
      name: "email",
      type: "email",
      required: true,
      placeholder: "Enter Email Address"
    },
    {
      label: "Mobile No",
      id: "mobileNumber",
      name: "mobileNumber",
      type: "tel",
      required: true,
      placeholder: "Enter Mobile Number"
    },
    {
      label: "Address",
      id: "presentAddressLine1",
      name: "presentAddressLine1",
      type: "text",
      required: true,
      placeholder: "Enter Address"
    },
    {
      label: "Pincode",
      id: "presentPincode",
      name: "presentPincode",
      type: "tel",
      required: true,
      placeholder: "Enter Pincode"
    },
    {
      label: "Country",
      id: "presentCountry",
      name: "presentCountry",
      type: "select",
      options: countryList,
      required: true,
      placeholder: "Select Country"
    },
    {
      label: "State",
      id: "presentState",
      name: "presentState",
      type: "select",
      options: mappedStates,
      required: true,
      placeholder: "Select State"
    },
    {
      label: "City",
      id: "presentCity",
      name: "presentCity",
      type: "select",
      options: mappedCities,
      required: true,
      placeholder: "Select City"
    },
    {
      label: "Password",
      id: "password",
      name: "password",
      type: "password",
      required: true,
      placeholder: "Enter Password"
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    let tempErrors = {};

    formFields.forEach(({ name, label, required }) => {
      const value = formData[name];
      if (required && !value?.trim()) {
        tempErrors[name] = ERROR_REQUIRED(label);
      }
    });

    setErrors(tempErrors);

    if (Object.keys(tempErrors).length > 0) {
      customToast({
        severity: ERROR,
        summary: OPPS_MSG,
        detail: ERROR_ALL_REQUIRED,
        life: 3000
      });
      setSubmitted(false);
      return;
    }

    const mapTitleToString = (id) => {
      switch (id) {
        case "1":
          return "Mr";
        case "2":
          return "Mrs";
        case "3":
          return "Ms";
        default:
          return "";
      }
    };

    try {
      window?.loadingStart?.();
      const payload = {
        title: mapTitleToString(formData.title),
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        gender: formData.gender,
        email: formData.email,
        password: formData.password,
        address: formData.presentAddressLine1,
        country: formData.presentCountry,
        city: formData.presentCity,
        state: formData.presentState,
        pinCode: formData.presentPincode,
        mobileNumber: formData.mobileNumber,
        dob: formData.dateOfBirth
      };

      const response = await api.post("/auth/register", payload);

      customToast({
        severity: SUCCESS,
        summary: SUCCESS_MSG,
        detail: response?.data?.message,
        life: 4000
      });

      // dispatch(
      //   loginSuccess({
      //     token: null,
      //     from: "register",
      //     user: response.data,
      //     otp: response.data.otp,
      //   })
      // );

      // if (response.data.otpSkipped) {
      navigate("/login");
      // } else {
      //   navigate("/validate-otp");
      // }
    } catch (err) {
      customToast({
        severity: ERROR,
        summary: OPPS_MSG,
        detail: err.response?.data?.message || OPPS_ERROR,
        life: 3000
      });
      setSubmitted(false);
    } finally {
      window?.loadingEnd?.();
    }
  };

  const renderField = (field) => {
    const { name, type, label, required, options = [] } = field;
    const value = formData[name] ?? "";
    const error = errors[name];
    const colClass = field.colClass || "col-12 col-md-4";

    return (
      <div key={name} className={colClass}>
        <label
          htmlFor={name}
          style={{
            display: "block",
            fontWeight: "600",
            marginBottom: "0.3rem"
          }}
        >
          {label} {required && <span style={{ color: "red" }}>*</span>}
        </label>
        <CustomInputField
          id={name}
          name={name}
          type={type}
          placeholder={field.placeholder}
          value={value}
          error={error}
          onChange={(e) => handleChange(e, required, label)}
          onBlur={(e) => handleOnBlur(e, required, label)}
          onPaste={(e) => onPaste(e, required, label)}
          options={options}
        />
      </div>
    );
  };

  return (
    <div
      style={{
        minHeight: "94vh",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1470&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "10px",
        overflowX: "hidden" // just in case something still pushes
      }}
    >
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-12 col-md-8">
            <div className="card">
              <div className="card-body">
                <h2
                  className="mb-3 text-center"
                  style={{
                    fontFamily: "'Brush Script MT', cursive",
                    fontWeight: "700",
                    fontSize: "2.8rem",
                    color: "#d35400",
                    textShadow: "1px 1px 2px #ba4a00"
                  }}
                >
                  Registration Form
                </h2>
                <form onSubmit={handleSubmit} noValidate autoComplete="off">
                  <div className="row g-2">{formFields.map(renderField)}</div>
                  <button
                    variant="warning"
                    type="submit"
                    disabled={submitted}
                    className="btn btn-warning w-100 mt-3 fw-semibold"
                  >
                    Register
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
