import React, { useState } from "react";
import { db, storage } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

const DriverForm = () => {
  // Name fields
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");

  // Form fields
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [plate_number, setPlate_number] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // File uploads
  const [plateImage, setPlateImage] = useState(null);
  const [vehicleImage, setVehicleImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [platePreview, setPlatePreview] = useState(null);
  const [vehiclePreview, setVehiclePreview] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);

  // Error states
  const [dobError, setDobError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === "plate") {
        setPlateImage(file);
        setPlatePreview(URL.createObjectURL(file));
      } else if (type === "vehicle") {
        setVehicleImage(file);
        setVehiclePreview(URL.createObjectURL(file));
      } else if (type === "profile") {
        setProfileImage(file);
        setProfilePreview(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();

    // Regex rules
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^\d{11}$/;
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{8,}$/;

    let hasError = false;

    // ✅ Age validation
    const birthDate = new Date(dob);
    const today = new Date();
    const age =
      today.getFullYear() -
      birthDate.getFullYear() -
      (today <
      new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())
        ? 1
        : 0);

    if (age < 18) {
      setDobError("You must be at least 18 years old to register.");
      alert("You must be at least 18 years old to register as a driver.");
      hasError = true;
    } else {
      setDobError("");
    }

    // ✅ Email validation
    if (!emailRegex.test(email)) {
      setEmailError("Invalid email format.");
      alert("Invalid email format.");
      hasError = true;
    } else {
      setEmailError("");
    }

    // ✅ Mobile validation
    if (!mobileRegex.test(mobileNumber)) {
      setMobileError("Mobile number must be exactly 11 digits.");
      alert("Mobile number must be exactly 11 digits.");
      hasError = true;
    } else {
      setMobileError("");
    }

    // ✅ Password validation
    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must be at least 8 chars, include 1 uppercase, 1 number, and 1 special char."
      );
      alert(
        "Password must be at least 8 chars, include 1 uppercase, 1 number, and 1 special char."
      );
      hasError = true;
    } else {
      setPasswordError("");
    }

    // ✅ Confirm password
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      alert("Passwords do not match.");
      hasError = true;
    } else {
      setConfirmPasswordError("");
    }

    // 🚨 stop if validation failed
    if (hasError) return;

    try {
      // ✅ Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const userId = user.uid;

      await sendEmailVerification(user);

      // ✅ Upload images
      const plateRef = ref(storage, `plateImages/${userId}_${plateImage.name}`);
      const vehicleRef = ref(
        storage,
        `vehicleImages/${userId}_${vehicleImage.name}`
      );
      const profileRef = ref(
        storage,
        `profilePictures/${userId}_${profileImage.name}`
      );

      await uploadBytes(plateRef, plateImage);
      await uploadBytes(vehicleRef, vehicleImage);
      await uploadBytes(profileRef, profileImage);

      const plateImageURL = await getDownloadURL(plateRef);
      const vehicleImageURL = await getDownloadURL(vehicleRef);
      const profileImageURL = await getDownloadURL(profileRef);

      const now = new Date();

      // ✅ Save to Firestore
      await setDoc(doc(db, "contact_information", userId), {
        uuid: userId,
        contact_name: `${firstName} ${middleName} ${lastName}`.trim(),
        email_address: email,
        mobile_number: mobileNumber,
        plate_number: plate_number,
        vehicle_model: vehicleModel,
        plate_image_url: plateImageURL,
        vehicle_image_url: vehicleImageURL,
        created_on: now,
      });

      await setDoc(doc(db, "account_information", userId), {
        uuid: userId,
        business_role: "driver",
        email_address: email,
        status: "idle",
        created_by: "tararide_automated_service",
        created_on: now,
        ride_id: "",
      });

      await setDoc(doc(db, "personal_information", userId), {
        user_id: userId,
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        sex_at_birth: gender,
        birth_date: new Date(dob),
        profilePicImage: profileImageURL,
      });

      alert("Account created! Please check your email for verification.");
      window.location.reload();
    } catch (error) {
      console.error("Submission failed:", error);

      // ✅ Firebase error handling
      if (error.code === "auth/email-already-in-use") {
        setEmailError("This email is already registered.");
        alert("This email is already registered.");
      } else if (error.code === "auth/invalid-email") {
        setEmailError("Invalid email address.");
        alert("Invalid email address.");
      } else if (error.code === "auth/weak-password") {
        setPasswordError("Password is too weak.");
        alert("Password is too weak.");
      } else {
        alert(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Become a Driver
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            First Name
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Middle Name */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Middle Name
          </label>
          <input
            type="text"
            value={middleName}
            onChange={(e) => setMiddleName(e.target.value)}
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Last Name
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={`mt-2 block w-full px-4 py-2 border ${
              emailError ? "border-red-500" : "border-gray-300"
            } rounded-md`}
          />
          {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`mt-2 block w-full px-4 py-2 border ${
                passwordError ? "border-red-500" : "border-gray-300"
              } rounded-md`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-2.5 text-sm text-blue-600"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {passwordError && (
            <p className="text-red-500 text-sm">{passwordError}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Confirm Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={`mt-2 block w-full px-4 py-2 border ${
              confirmPasswordError ? "border-red-500" : "border-gray-300"
            } rounded-md`}
          />
          {confirmPasswordError && (
            <p className="text-red-500 text-sm">{confirmPasswordError}</p>
          )}
        </div>

        {/* Mobile */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Mobile Number
          </label>
          <input
            type="tel"
            inputMode="numeric"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
            required
            className={`mt-2 block w-full px-4 py-2 border ${
              mobileError ? "border-red-500" : "border-gray-300"
            } rounded-md`}
          />
          {mobileError && <p className="text-red-500 text-sm">{mobileError}</p>}
        </div>

        {/* Vehicle Model */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Vehicle Model
          </label>
          <input
            type="text"
            value={vehicleModel}
            onChange={(e) => setVehicleModel(e.target.value)}
            required
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Gender
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* DOB */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Date of Birth
          </label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          {dobError && <p className="text-red-500 text-sm">{dobError}</p>}
        </div>

        {/* Vehicle Image */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Upload Vehicle Model Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, "vehicle")}
            required
            className="mt-2 block w-full border border-gray-300 rounded-md"
          />
          {vehiclePreview && (
            <img
              src={vehiclePreview}
              alt="Vehicle Preview"
              className="w-32 h-32 mt-2 object-cover rounded-md"
            />
          )}
        </div>

        {/* Plate Number */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Plate Number
          </label>
          <input
            type="text"
            value={plate_number}
            onChange={(e) => setPlate_number(e.target.value)}
            required
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Plate Image */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Upload Plate Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, "plate")}
            required
            className="mt-2 block w-full border border-gray-300 rounded-md"
          />
          {platePreview && (
            <img
              src={platePreview}
              alt="Plate Preview"
              className="w-32 h-32 mt-2 object-cover rounded-md"
            />
          )}
        </div>

        {/* Profile Image */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Upload Profile Picture
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, "profile")}
            required
            className="mt-2 block w-full border border-gray-300 rounded-md"
          />
          {profilePreview && (
            <img
              src={profilePreview}
              alt="Profile Preview"
              className="w-32 h-32 mt-2 object-cover rounded-full border"
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default DriverForm;
