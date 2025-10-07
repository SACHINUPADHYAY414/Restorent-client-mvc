import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../components/action/Api";
import { useToastr } from "../../components/toast/Toast";

const fieldSchema = [
  {
    name: "title",
    label: "Title",
    type: "select",
    optionsKey: "titles",
    required: false,
    colClass: "col-md-3"
  },
  {
    name: "gender",
    label: "Gender",
    type: "select",
    optionsKey: "genders",
    required: false,
    colClass: "col-md-3"
  },
  {
    name: "name",
    label: "Name",
    type: "text",
    required: true,
    colClass: "col-md-3",
    placeholder: "Full Name"
  },
  {
    name: "mobile",
    label: "Mobile",
    type: "text",
    required: true,
    maxLength: 10,
    pattern: /^\d{10}$/,
    errorMessage: "Mobile must be exactly 10 digits.",
    colClass: "col-md-3",
    placeholder: "Mobile No"
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
    pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
    errorMessage: "Please enter a valid email address.",
    colClass: "col-md-3",
    placeholder: "Enter Email"
  },
  {
    name: "pincode",
    label: "Pincode",
    type: "text",
    required: true,
    maxLength: 10,
    pattern: /^\d{6,10}$/,
    errorMessage: "Pincode must be between 6 and 10 digits.",
    colClass: "col-md-3",
    placeholder: "Pin Code"
  },
  {
    name: "state",
    label: "State",
    type: "select",
    optionsKey: "states",
    required: false,
    colClass: "col-md-3"
  },
  {
    name: "city",
    label: "City",
    type: "select",
    optionsKey: "cities",
    required: false,
    colClass: "col-md-3"
  },
  {
    name: "country",
    label: "Country",
    type: "select",
    optionsKey: "countries",
    required: false,
    colClass: "col-md-3"
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    required: true,
    minLength: 6,
    errorMessage: "Password is required.",
    colClass: "col-md-3",
    placeholder: "Enter Password"
  }
];

const Register = () => {
  const { customToast } = useToastr();
  const [form, setForm] = useState({});
  const [options, setOptions] = useState({
    titles: [],
    genders: [],
    states: [],
    cities: [],
    countries: []
  });
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDropdowns() {
      try {
        window?.loadingStart?.();
        const [t, g, s, c, countries] = await Promise.all([
          api.get("/titles"),
          api.get("/genders"),
          api.get("/states"),
          api.get("/cities"),
          api.get("/countries")
        ]);
        setOptions({
          titles: t.data,
          genders: g.data,
          states: s.data,
          cities: c.data,
          countries: countries.data
        });
      } catch (e) {
        console.error("Dropdown fetch failed", e.message);
        customToast({
          severity: "error",
          summary: "Error!",
          detail: e.message,
          life: 3000
        });
      } finally {
        window?.loadingEnd?.();
      }
    }

    fetchDropdowns();
  }, [customToast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["mobile", "pincode"].includes(name)) {
      if (!/^\d*$/.test(value)) return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    for (let field of fieldSchema) {
      const value = form[field.name];

      if (field.required && !value) {
        return `${field.label} is required.`;
      }

      if (field.pattern && value && !field.pattern.test(value)) {
        return field.errorMessage || `Invalid ${field.label}.`;
      }

      if (field.minLength && value?.length < field.minLength) {
        return (
          field.errorMessage ||
          `${field.label} must be at least ${field.minLength} characters.`
        );
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      return customToast({
        severity: "error",
        summary: "Validation Error",
        detail: validationError,
        life: 3000
      });
    }

    try {
      window?.loadingStart?.();
      await api.post("/register", form);
      customToast({
        severity: "success",
        summary: "Success!",
        detail: "Registration successful!"
      });
      navigate("/login");
    } catch (err) {
      customToast({
        severity: "error",
        summary: "Oops!",
        detail: err?.response?.data?.message || "An error occurred",
        life: 3000
      });
    } finally {
      window?.loadingEnd?.();
    }
  };

  return (
    <section
      className="d-flex bg-danger justify-content-center align-items-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1470&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "90vh"
      }}
    >
      <div className="py-4">
        <div
          className="card p-4 shadow rounded"
          style={{ maxWidth: "700px", width: "100%" }}
        >
          <h2 className="mb-4 text-center">Register</h2>
          <form className="row g-3" onSubmit={handleSubmit}>
            {fieldSchema.map((field) => (
              <div className={field.colClass || "col-12"} key={field.name}>
                <label htmlFor={field.name} className="form-label">
                  {field.label}
                </label>
                {field.type === "select" ? (
                  <select
                    id={field.name}
                    name={field.name}
                    className="form-select"
                    value={form[field.name] || ""}
                    onChange={handleChange}
                    required={field.required}
                  >
                    <option value="">Select {field.label}</option>
                    {options[field.optionsKey]?.map((opt, idx) => (
                      <option key={idx} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    className="form-control"
                    value={form[field.name] || ""}
                    onChange={handleChange}
                    required={field.required}
                    maxLength={field.maxLength || undefined}
                    minLength={field.minLength || undefined}
                    placeholder={field.placeholder}
                    inputMode={
                      ["mobile", "pincode"].includes(field.name)
                        ? "numeric"
                        : undefined
                    }
                    onKeyPress={(e) => {
                      if (
                        ["mobile", "pincode"].includes(field.name) &&
                        !/[0-9]/.test(e.key)
                      ) {
                        e.preventDefault();
                      }
                    }}
                  />
                )}
              </div>
            ))}
            <div className="col-12 d-grid mt-3">
              <button type="submit" className="btn btn-primary">
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Register;
