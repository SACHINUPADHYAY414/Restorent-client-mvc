import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import api from "../../components/action/Api";
import { useToastr } from "../../components/toast/Toast";
import CustomInputField from "../../components/customInput/CustomInputField";
import {
  sanitizeInput,
  sanitizeEmail,
  sanitizeMobileNumber,
  sanitizeAddress,
  sanitizeZipCode,
  validatePersonName,
  validateDateOfBirthField,
  verifyStartingOrEndingCharacters,
  verifyDoubleSpace,
  verifyEmail
} from "../../utills/allValidation";
import {
  ERROR,
  OPPS_MSG,
  SERVER_ERROR,
  ERROR_LEADING_OR_TRAILING_SPACE,
  ERROR_DOUBLE_SPACE,
  ERROR_REQUIRED,
  ERROR_MAXIMUM_LENGTH,
  ERROR_MINIMUM_LENGTH,
  ERROR_MUST_LENGTH,
  ERROR_VALIDATE_EMAIL,
  DOB_RANGE_MESSAGE,
  ERROR_ALL_REQUIRED
} from "../../utills/string";
import { useMediaQuery } from "react-responsive";
import { defaultImages } from "../../utills/images";
import TooltipWrapper from "../../components/Tooltip/TooltipWrapper";
const titleList = [
  { id: "1", name: "Mr." },
  { id: "2", name: "Mrs." },
  { id: "3", name: "Ms." }
];

const genderList = [
  { id: "1", name: "Male" },
  { id: "2", name: "Female" },
  { id: "3", name: "Other" }
];

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const countryIdRedux = useSelector((state) => state.auth.user.country);
  const stateIdRedux = useSelector((state) => state.auth.user.state);
  const cityIdRedux = useSelector((state) => state.auth.user.city);
  const genderId = useSelector((state) => state.auth.user.gender);
  const { customToast } = useToastr();
  const [editMode, setEditMode] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);

  const [errors, setErrors] = useState({});

  const getTitleId = () => {
    if (!user.title) return "";
    const userTitleNormalized = user.title.replace(".", "").toLowerCase();
    const found = titleList.find(
      (t) => t.name.replace(".", "").toLowerCase() === userTitleNormalized
    );
    return found?.id || "";
  };

  const [formData, setFormData] = useState({
    title: getTitleId(),
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    gender: genderId,
    dateOfBirth: user.dob || "",
    presentAddressLine1: user.address || "",
    presentPincode: user.pinCode || "",
    presentCountry: countryIdRedux || "",
    presentState: stateIdRedux || "",
    presentCity: cityIdRedux || "",
    email: user.email || "",
    mobileNumber: user.mobileNumber || ""
  });

  const selectFields = [
    "title",
    "gender",
    "presentCountry",
    "presentState",
    "presentCity"
  ];

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        window?.loadingStart?.();
        const res = await api.get("/country/countries");
        const countries = res.data || [];

        if (Array.isArray(countries)) {
          setCountryList(countries);
        } else {
          setCountryList([]);
          customToast({
            severity: ERROR,
            summary: OPPS_MSG,
            detail: "Invalid country data format received",
            life: 4000
          });
        }
      } catch (err) {
        customToast({
          severity: ERROR,
          summary: OPPS_MSG,
          detail: err?.message || err.message,
          life: 4000
        });
      } finally {
        window?.loadingEnd?.();
      }
    };

    fetchCountries();
  }, [customToast]);

  useEffect(() => {
    const fetchStates = async () => {
      const cId = formData.presentCountry;
      if (!cId) {
        setStateList([]);
        setCityList([]);
        setFormData((prev) => ({
          ...prev,
          presentState: "",
          presentCity: ""
        }));
        return;
      }
      try {
        window?.loadingStart?.();
        const res = await api.get(`/states?countryId=${cId}`);
        setStateList(res.data);
      } catch (err) {
        customToast({
          severity: ERROR,
          summary: OPPS_MSG,
          detail: err?.message || err.message,
          life: 4000
        });
      } finally {
        window?.loadingEnd?.();
      }
    };
    fetchStates();
  }, [formData.presentCountry, customToast]);

  useEffect(() => {
    const fetchCities = async () => {
      const sId = formData.presentState;
      if (!sId) {
        setCityList([]);
        setFormData((prev) => ({ ...prev, presentCity: "" }));
        return;
      }
      try {
        window?.loadingStart?.();
        const res = await api.get(`/cities/state/${sId}`);
        setCityList(res.data);
      } catch (err) {
        customToast({
          severity: ERROR,
          summary: OPPS_MSG,
          detail: err?.message || err.message,
          life: 4000
        });
      } finally {
        window?.loadingEnd?.();
      }
    };
    fetchCities();
  }, [formData.presentState, customToast]);

  const mappedCountries = useMemo(
    () =>
      countryList.map((c) => ({
        value: c.countryId?.toString() || c.id?.toString(),
        label: c.name
      })),
    [countryList]
  );

  const mappedStates = useMemo(
    () =>
      stateList.map((s) => ({
        id: s.stateId?.toString() || s.id?.toString(),
        name: s.name
      })),
    [stateList]
  );

  const mappedCities = useMemo(
    () =>
      cityList.map((c) => ({
        id: c.cityId?.toString() || c.id?.toString(),
        name: c.name
      })),
    [cityList]
  );

  const handleChange = useCallback((e, required = false, label = "") => {
    const { name, value: rawValue } = e.target;
    let value = rawValue;
    let error = "";

    if (!selectFields.includes(name)) {
      value = sanitizeInput(value);

      if (!value && required) {
        error = ERROR_REQUIRED(label);
      } else if (!verifyStartingOrEndingCharacters(value)) {
        error = ERROR_LEADING_OR_TRAILING_SPACE;
      }

      switch (name) {
        case "firstName":
        case "lastName":
          value = validatePersonName(value);
          if (value.length > 30) error = ERROR_MAXIMUM_LENGTH(30);
          break;
        case "presentAddressLine1":
          value = sanitizeAddress(value);
          if (value.length > 250) error = ERROR_MAXIMUM_LENGTH(250);
          break;
        case "presentPincode":
          value = sanitizeZipCode(value, 6);
          break;
        case "mobileNumber":
          value = sanitizeMobileNumber(value);
          break;
        case "email":
          value = sanitizeEmail(value);
          break;
        case "dateOfBirth":
          if (!validateDateOfBirthField(value)) {
            error = DOB_RANGE_MESSAGE;
          }
          break;
        default:
          break;
      }
    }

    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: error }));

    if (name === "title") {
      setFormData((prev) => ({
        ...prev,
        gender: value === "1" ? "1" : "2"
      }));
    }
    if (name === "presentCountry") {
      setFormData((p) => ({ ...p, presentState: "", presentCity: "" }));
      setStateList([]);
      setCityList([]);
    }
    if (name === "presentState") {
      setFormData((p) => ({ ...p, presentCity: "" }));
      setCityList([]);
    }
  }, []);

  const handleOnBlur = useCallback((e, required, label) => {
    const { name, value } = e.target;
    let error = "";

    if (selectFields.includes(name)) return;

    if (!value && required) {
      error = ERROR_REQUIRED(label);
    } else {
      if (!verifyStartingOrEndingCharacters(value)) {
        error = ERROR_LEADING_OR_TRAILING_SPACE;
      } else if (verifyDoubleSpace(value)) {
        error = ERROR_DOUBLE_SPACE;
      }

      switch (name) {
        case "presentAddressLine1":
          if (value.length < 3 || value.length > 250) {
            error =
              value.length < 3
                ? ERROR_MINIMUM_LENGTH(3)
                : ERROR_MAXIMUM_LENGTH(250);
          }
          break;
        case "presentPincode":
          if (value.length !== 6) {
            error = ERROR_MUST_LENGTH(6);
          }
          break;
        case "mobileNumber":
          if (value.length !== 10) {
            error = ERROR_MUST_LENGTH(10);
          }
          break;
        case "email":
          if (!verifyEmail(value)) {
            error = ERROR_VALIDATE_EMAIL;
          }
          break;
        default:
          break;
      }
    }

    setErrors((p) => ({ ...p, [name]: error }));
  }, []);

  const formFields = [
    {
      label: "Title",
      name: "title",
      type: "select",
      options: titleList,
      required: true
    },
    {
      label: "Gender",
      name: "gender",
      type: "select",
      options: genderList,
      required: true
    },
    {
      label: "Date of Birth",
      name: "dateOfBirth",
      type: "date",
      required: false
    },
    { label: "Email", name: "email", type: "email", required: true },
    {
      label: "Mobile Number",
      name: "mobileNumber",
      type: "tel",
      required: true
    },
    {
      label: "Address",
      name: "presentAddressLine1",
      type: "text",
      required: true
    },
    { label: "Pincode", name: "presentPincode", type: "text", required: true },
    {
      label: "Country",
      name: "presentCountry",
      type: "select",
      options: mappedCountries,
      required: true
    },
    {
      label: "State",
      name: "presentState",
      type: "select",
      options: mappedStates,
      required: true
    },
    {
      label: "City",
      name: "presentCity",
      type: "select",
      options: mappedCities,
      required: true
    }
  ];

  const onSubmit = async () => {
    let hasError = false;
    let newErrors = {};

    formFields.forEach((f) => {
      if (f.required && !formData[f.name]?.toString().trim()) {
        newErrors[f.name] = ERROR_REQUIRED(f.label);
        hasError = true;
      }
    });

    setErrors(newErrors);

    if (hasError) {
      customToast({
        severity: ERROR,
        summary: OPPS_MSG,
        detail: ERROR_ALL_REQUIRED,
        life: 3000
      });
      return;
    }

    try {
      window?.loadingStart?.();
      await api.put("/user/profile", formData);
      customToast({
        severity: "success",
        summary: "Success",
        detail: "Profile updated!",
        life: 3000
      });
      setEditMode(false);
    } catch (err) {
      const msg = err?.response?.data?.message || SERVER_ERROR;
      customToast({
        severity: ERROR,
        summary: OPPS_MSG,
        detail: msg,
        life: 4000
      });
    } finally {
      window?.loadingEnd?.();
    }
  };

  const renderField = (field) => {
    const { name, type, label, options = [], required } = field;
    const value = formData[name] ?? "";
    const error = errors[name];
    const disabled = !editMode;

    return (
      <div key={name} className="col-12 col-md-4">
        <label htmlFor={name} className="form-label">
          {label} {required && <span className="text-danger">*</span>}
        </label>
        <CustomInputField
          id={name}
          name={name}
          type={type}
          value={value}
          disabled={disabled}
          options={options}
          onChange={(e) => handleChange(e, required, label)}
          onBlur={(e) => handleOnBlur(e, required, label)}
          error={error}
        />
      </div>
    );
  };

  const getProfileImage = () => {
    if (user.profile) return user.profile;
    const gender = user.gender;
    if (gender === "1" || gender === 1) return defaultImages.male;
    if (gender === "2" || gender === 2) return defaultImages.female;
    if (gender === "3" || gender === 3) return defaultImages.other;
    return defaultImages.other;
  };
return (
  <>
    {!isMobile ? (
      <div style={{ padding: "20px 0" }}>
        <div className="container my-0 my-md-4">
          <div
            className="card shadow-sm p-4 pb-3"
            style={{
              maxWidth: 1000,
              margin: "auto",
              borderRadius: 12,
              backgroundColor: "#fff"
            }}
          >
            <div className="d-flex justify-content-start align-items-center mb-2 mb-md-4 d-none d-md-flex">
              <div className="position-relative me-4">
                <img
                  src={getProfileImage()}
                  alt="Profile"
                  className="rounded-circle d-flex align-items-center justify-content-center border shadow-lg"
                  style={{
                    width: 100,
                    height: 100,
                    objectFit: "cover",
                    backgroundColor: "#f8f9fa",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
                  }}
                />
                {editMode && (
                  <button
                    className="btn btn-sm btn-light position-absolute"
                    style={{ bottom: 0, right: 0, borderRadius: "50%" }}
                  >
                    ✎
                  </button>
                )}
              </div>
              <div>
                <h4
                  className="fw-bold"
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    fontSize: "1.8rem",
                    color: "#4a4a4a",
                    letterSpacing: "0.03em"
                  }}
                >
                  {user.name}
                </h4>
              </div>
            </div>

            <div className="row mx-2 g-2">{formFields.map(renderField)}</div>

            <div className="justify-content-center align-items-center text-center text-md-end mb-md-0 mb-3 mt-3">
              {!editMode ? (
                <TooltipWrapper tooltipMessage="Temporary disable">
                  <span className="d-inline-block" tabIndex="0">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setEditMode(true)}
                      disabled
                      style={{ pointerEvents: "none" }}
                    >
                      Edit Profile
                    </button>
                  </span>
                </TooltipWrapper>
              ) : (
                <button className="btn btn-success btn-sm" onClick={onSubmit}>
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="my-0 my-md-4">
        <div
          style={{
            maxWidth: "100%",
            margin: "auto",
            borderRadius: 0,
            backgroundColor: "transparent",
            padding: 0
          }}
        >
          <div className="d-md-none" style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: 150,
                overflow: "hidden",
                zIndex: 0
              }}
            >
              <svg
                viewBox="0 0 500 150"
                preserveAspectRatio="none"
                style={{ height: "100%", width: "100%" }}
              >
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e9dca8" />
                    <stop offset="100%" stopColor="#c6b57e" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 67 C 150 150 350 0 500 67 L500 00 L0 0 Z"
                  fill="url(#grad)"
                />
              </svg>
            </div>

            <div
              className="d-flex justify-content-center"
              style={{ position: "relative", zIndex: 1, paddingTop: 40 }}
            >
              <div style={{ position: "relative" }}>
                <img
                  src={getProfileImage()}
                  alt="Profile"
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: "100px",
                    height: "100px",
                    background: "radial-gradient(circle, #fdf6e3, #d1c291)",
                    fontSize: "36px",
                    color: "#7b6f4e",
                    border: "2px solid #bba76b",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
                  }}
                />
                {editMode && (
                  <button
                    className="btn btn-light btn-sm position-absolute"
                    style={{
                      bottom: 0,
                      right: 0,
                      borderRadius: "50%",
                      border: "1px solid #ccc"
                    }}
                  >
                    ✎
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="row mx-2">{formFields.map(renderField)}</div>

          <div className="justify-content-center align-items-center mt-3 text-center text-md-end mb-md-0 mb-4">
            {!editMode ? (
              <TooltipWrapper tooltipMessage="Temporary disable">
                <span className="d-inline-block" tabIndex="0">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setEditMode(true)}
                    disabled
                    style={{ pointerEvents: "none" }}
                  >
                    Edit Profile
                  </button>
                </span>
              </TooltipWrapper>
            ) : (
              <button className="btn btn-success btn-sm" onClick={onSubmit}>
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    )}
  </>
);

};

export default Profile;