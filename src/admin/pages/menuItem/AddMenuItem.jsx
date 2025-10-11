import React, { useCallback, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Container, Form, Button } from "react-bootstrap";
import { useToastr } from "../../../components/toast/Toast";
import api from "../../../components/action/Api";
import CustomInputField from "../../../components/customInput/CustomInputField";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ERROR,
  OPPS_MSG,
  SERVER_ERROR,
  SUCCESS,
  ERROR_REQUIRED,
  ERROR_LEADING_OR_TRAILING_SPACE,
  ERROR_DOUBLE_SPACE,
  ERROR_MINIMUM_LENGTH,
  ERROR_MAXIMUM_LENGTH,
  ERROR_PASTE_DATA
} from "../../../utills/string";
import {
  sanitizeInput,
  start_with_char,
  verifyDoubleSpace,
  verifyPasteData,
  verifyStartingOrEndingCharacters,
  validateLength,
  validatePersonName
} from "../../../utills/allValidation";

const AddEditMenuItem = () => {
  const { customToast } = useToastr();
  const userId = useSelector((state) => state.auth.user.id);
  const location = useLocation();
  const navigate = useNavigate();

  const id = location.state?.id || null;
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    type: "",
    tags: ""
  });
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      const fetchMenuItem = async () => {
        try {
          window?.loadingStart?.();
          const response = await api.get(`/menu/${id}/${userId}`);
          const item = response.data;
          setFormData({
            title: item.title || "",
            description: item.description || "",
            price: item.price || "",
            type: item.type || "",
            tags: item.tags ? item.tags.join(", ") : "",
            imageUrl: item.image || ""
          });
          setImage(null);
        } catch (err) {
          customToast({
            severity: ERROR,
            summary: OPPS_MSG,
            detail: err?.response?.data?.error || SERVER_ERROR,
            life: 4000
          });
        } finally {
          window?.loadingEnd?.();
        }
      };
      fetchMenuItem();
    }
  }, [id, isEditMode, customToast, userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, description, price, type, tags } = formData;

    if (
      !title.trim() ||
      !description.trim() ||
      !price.trim() ||
      !type.trim() ||
      !tags.trim() ||
      (!image && !isEditMode)
    ) {
      customToast({
        severity: ERROR,
        summary: OPPS_MSG,
        detail: "Please fill all fields and upload an image.",
        life: 3000,
      });
      return;
    }

    try {
      window?.loadingStart?.();
      const formPayload = new FormData();
      formPayload.append("title", title);
      formPayload.append("description", description);
      formPayload.append("price", price);
      formPayload.append("type", type);
      formPayload.append("tags", tags);
      if (image) {
        formPayload.append("image", image);
      }

      if (isEditMode) {
        await api.put(`/menu/update/${id}/${userId}`, formPayload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        customToast({
          severity: SUCCESS,
          summary: "Success",
          detail: "Menu item updated successfully!",
          life: 3000,
        });
      } else {
        await api.post(`/menu/add/${userId}`, formPayload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        customToast({
          severity: SUCCESS,
          summary: "Success",
          detail: "Menu item added successfully!",
          life: 3000,
        });
      }
      navigate("/dashboard/menu-items");
    } catch (err) {
      customToast({
        severity: ERROR,
        summary: OPPS_MSG,
        detail: err?.response?.data?.error || SERVER_ERROR,
        life: 4000,
      });
    } finally {
      window?.loadingEnd?.();
    }
  };

  const handleChange = useCallback(
    (e, required = false, label = "", pastedValue = "") => {
      let { name, value } = e.target;
      if (pastedValue) value = pastedValue;
      let sanitizedValue = sanitizeInput(value);
      let updatedValue = sanitizedValue;
      let error = "";

      if (required && !value.trim()) {
        error = ERROR_REQUIRED(label);
      } else if (!start_with_char.test(value)) {
        error = ERROR_LEADING_OR_TRAILING_SPACE;
      }
      if (!error) {
        switch (name) {
          case "title":
          case "type":
          case "tags":
            updatedValue = validatePersonName(sanitizedValue);
            if (updatedValue.length > 30) error = ERROR_MAXIMUM_LENGTH(30);
            break;
          case "description":
            updatedValue = validatePersonName(sanitizedValue);
            if (updatedValue.length > 200) error = ERROR_MAXIMUM_LENGTH(200);
            break;
          default:
            break;
        }
      }

      setFormData((prev) => ({ ...prev, [name]: updatedValue }));
      setErrors((prev) => ({ ...prev, [name]: error }));
    },
    []
  );

  const handleOnBlur = useCallback((e, required, label) => {
    const { name, value } = e.target;
    let error = "";

    if (!value && required) {
      error = ERROR_REQUIRED(label);
    } else {
      if (!verifyStartingOrEndingCharacters(value)) {
        error = ERROR_LEADING_OR_TRAILING_SPACE;
      } else if (verifyDoubleSpace(value)) {
        error = ERROR_DOUBLE_SPACE;
      }

      switch (name) {
        case "title":
          if (!validateLength(value, 2, 50)) {
            error =
              value.length < 2
                ? ERROR_MINIMUM_LENGTH(2)
                : ERROR_MAXIMUM_LENGTH(50);
          }
          break;
        case "description":
          if (!validateLength(value, 5, 250)) {
            error =
              value.length < 5
                ? ERROR_MINIMUM_LENGTH(5)
                : ERROR_MAXIMUM_LENGTH(250);
          }
          break;
        case "price":
          if (!validateLength(value, 1, 10)) {
            error =
              value.length < 1
                ? ERROR_MINIMUM_LENGTH(1)
                : ERROR_MAXIMUM_LENGTH(10);
          }
          break;
        case "tags":
        case "type":
          if (!validateLength(value, 2, 50)) {
            error =
              value.length < 2
                ? ERROR_MINIMUM_LENGTH(2)
                : ERROR_MAXIMUM_LENGTH(50);
          }
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
      label: "Name",
      id: "title",
      name: "title",
      type: "text",
      required: true,
      placeholder: "Enter Item Name"
    },
    {
      label: "Description",
      id: "description",
      name: "description",
      type: "text",
      required: true,
      placeholder: "Enter Description"
    },
    {
      label: "Menu Type",
      id: "type",
      name: "type",
      type: "text",
      required: true,
      placeholder: "Enter Menu Type"
    },
    {
      label: "Menu Tag",
      id: "tags",
      name: "tags",
      type: "text",
      required: true,
      placeholder: "Enter Menu Tag"
    },
    {
      label: "Price",
      id: "price",
      name: "price",
      type: "tel",
      required: true,
      placeholder: "Enter Price"
    }
  ];

  const renderField = (field) => {
    const { name, type, label, required } = field;
    const value = formData[name] ?? "";
    const error = errors[name];
    const colClass = field.colClass || "col-12 col-md-3";

    return (
      <div key={name} className={colClass}>
        <label htmlFor={name} className="fw-semibold mb-1">
          {label} {required && <span className="text-danger">*</span>}
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
        />
      </div>
    );
  };

  return (
    <div className="w-100" style={{ minHeight: "61vh" }}>
      <h4 className="page-h">
        {isEditMode ? "Edit Menu Item" : "Add Menu Item"}
      </h4>
      <div className="card">
        <div className="card-body">
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <input
                id="image"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => setImage(e.target.files[0])}
              />
              <label
                htmlFor="image"
                className="d-inline-flex rounded-circle border border-2 border-secondary overflow-hidden justify-content-center align-items-center"
                style={{
                  width: "80px",
                  height: "80px",
                  cursor: "pointer",
                  backgroundColor: "#f8f9fa"
                }}
              >
                {image ? (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="w-100 h-100"
                    style={{ objectFit: "cover" }}
                  />
                ) : formData.imageUrl ? (
                  <img
                    src={formData.imageUrl}
                    alt="Existing"
                    className="w-100 h-100"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <span className="text-muted text-center">Image</span>
                )}
              </label>
            </Form.Group>

            <div className="row gx-2 mb-3">{formFields.map(renderField)}</div>

            <Button type="submit" variant="primary">
              {isEditMode ? "Update Menu Item" : "Add Menu Item"}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AddEditMenuItem;
