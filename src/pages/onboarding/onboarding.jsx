// src/components/onboarding/Onboarding.jsx
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";
import classNames from "classnames";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// ---------- Step Components ----------
const IdentityStep = ({ role, docs, setDocs, step }) => {
  const identityDocs = role === "rider"
    ? ["NIN", "Voters Card", "Passport", "Driver License"]
    : ["NIN", "Voters Card", "Passport"];

  const handleFileChange = (e, doc) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) return alert("File too large! Max 5MB");
    const reader = new FileReader();
    reader.onloadend = () => {
      if (role === "rider") {
        setDocs((prev) => ({
          ...prev,
          identity: { ...prev.identity, [doc]: reader.result },
        }));
      } else {
        setDocs((prev) => ({
          ...prev,
          identity: { ...prev.identity, [doc]: reader.result },
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = (doc) => {
    const copy = { ...docs.identity };
    delete copy[doc];
    setDocs((prev) => ({ ...prev, identity: copy }));
  };

  return (
    <div className={classNames("transition-opacity duration-500", step === 1 ? "opacity-100" : "opacity-0 hidden")}>
      <h2 className="text-xl font-bold mb-4">Upload Identity Documents</h2>
      {identityDocs.map((doc) => (
        <div key={doc} className="mb-2 flex items-center">
          <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, doc)} />
          {docs.identity[doc] && (
            <button onClick={() => handleRemove(doc)} className="ml-2 text-red-500">
              Remove
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

const PassportStep = ({ docs, setDocs, step, cameraActive, setCameraActive, videoRef }) => {
  const handleCameraCapture = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/png");
    setDocs((prev) => ({ ...prev, passport: dataUrl, passportPreview: dataUrl }));
    stopCamera();
  };

  const startCamera = async () => {
    setCameraActive(true);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  };

  const stopCamera = () => {
    setCameraActive(false);
    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) return alert("File too large! Max 5MB");
    const reader = new FileReader();
    reader.onloadend = () => {
      setDocs((prev) => ({ ...prev, passport: reader.result, passportPreview: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => setDocs((prev) => ({ ...prev, passport: null, passportPreview: null }));

  return (
    <div className={classNames("transition-opacity duration-500", step === 2 ? "opacity-100" : "opacity-0 hidden")}>
      <h2 className="text-xl font-bold mb-4">Upload Passport Photo</h2>
      {docs.passportPreview && <img src={docs.passportPreview} alt="passport preview" className="w-32 h-32 object-cover mb-2" />}
      <div className="flex gap-2 mb-2">
        <button onClick={startCamera} className="btn">Open Camera</button>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>
      {cameraActive && (
        <div>
          <video ref={videoRef} className="w-64 h-48 border mb-2" />
          <button onClick={handleCameraCapture} className="btn">Capture</button>
          <button onClick={stopCamera} className="btn ml-2">Cancel</button>
        </div>
      )}
      {docs.passport && <button onClick={handleRemove} className="ml-2 text-red-500">Remove</button>}
    </div>
  );
};

const VehicleStep = ({ docs, setDocs, step }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) return alert("File too large! Max 5MB");
    const reader = new FileReader();
    reader.onloadend = () => setDocs((prev) => ({ ...prev, vehicle: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleRemove = () => setDocs((prev) => ({ ...prev, vehicle: null }));

  return (
    <div className={classNames("transition-opacity duration-500", step === 3 ? "opacity-100" : "opacity-0 hidden")}>
      <h2 className="text-xl font-bold mb-4">Upload Vehicle Photo</h2>
      {docs.vehicle && <img src={docs.vehicle} alt="vehicle" className="w-32 h-32 object-cover mb-2" />}
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {docs.vehicle && <button onClick={handleRemove} className="ml-2 text-red-500">Remove</button>}
    </div>
  );
};

const CACStep = ({ docs, setDocs, step }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) return alert("File too large! Max 5MB");
    const reader = new FileReader();
    reader.onloadend = () => setDocs((prev) => ({ ...prev, cac: reader.result }));
    reader.readAsDataURL(file);
  };

  return (
    <div className={classNames("transition-opacity duration-500", step === 2 ? "opacity-100" : "opacity-0 hidden")}>
      <h2 className="text-xl font-bold mb-4">Upload CAC Document</h2>
      <input type="file" accept="image/*" disabled={docs.skipCAC} onChange={handleFileChange} />
      <div className="mt-2">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={docs.skipCAC} onChange={(e) => setDocs((prev) => ({ ...prev, skipCAC: e.target.checked }))} />
          CAC not ready yet
        </label>
      </div>
    </div>
  );
};

const ShopCityStep = ({ docs, setDocs, step }) => (
  <div className={classNames("transition-opacity duration-500", step === 3 ? "opacity-100" : "opacity-0 hidden")}>
    <h2 className="text-xl font-bold mb-4">Select Shop City</h2>
    <select className="border p-2 w-full" value={docs.shopCity} onChange={(e) => setDocs((prev) => ({ ...prev, shopCity: e.target.value }))}>
      <option value="">Select city</option>
      <option value="Lagos">Lagos</option>
      <option value="Abuja">Abuja</option>
      <option value="Port Harcourt">Port Harcourt</option>
    </select>
  </div>
);

const ShopPhotoStep = ({ docs, setDocs, step }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) return alert("File too large! Max 5MB");
    const reader = new FileReader();
    reader.onloadend = () => setDocs((prev) => ({ ...prev, shopPhoto: reader.result }));
    reader.readAsDataURL(file);
  };
  const handleRemove = () => setDocs((prev) => ({ ...prev, shopPhoto: null }));

  return (
    <div className={classNames("transition-opacity duration-500", step === 4 ? "opacity-100" : "opacity-0 hidden")}>
      <h2 className="text-xl font-bold mb-4">Upload Shop Photo</h2>
      {docs.shopPhoto && <img src={docs.shopPhoto} alt="shop" className="w-32 h-32 object-cover mb-2" />}
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {docs.shopPhoto && <button onClick={handleRemove} className="ml-2 text-red-500">Remove</button>}
    </div>
  );
};

// ---------- Main Onboarding Component ----------
const Onboarding = ({ role }) => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [step, setStep] = useState(1);

  const [riderDocs, setRiderDocs] = useState({
    identity: {},
    passport: null,
    passportPreview: null,
    vehicle: null,
  });

  const [vendorDocs, setVendorDocs] = useState({
    identity: {},
    cac: null,
    skipCAC: false,
    shopCity: "",
    shopPhoto: null,
  });

  const docs = role === "rider" ? riderDocs : vendorDocs;
  const setDocs = role === "rider" ? setRiderDocs : setVendorDocs;

  // ---------- Step control ----------
  const canProceed = () => {
    if (role === "rider") {
      if (step === 1) return Object.keys(riderDocs.identity).length > 0;
      if (step === 2) return !!riderDocs.passport;
      if (step === 3) return !!riderDocs.vehicle;
    } else {
      if (step === 1) return Object.keys(vendorDocs.identity).length > 0;
      if (step === 2) return vendorDocs.skipCAC || !!vendorDocs.cac;
      if (step === 3) return !!vendorDocs.shopCity;
      if (step === 4) return !!vendorDocs.shopPhoto;
    }
    return false;
  };

  const handleNextStep = () => setStep((prev) => prev + 1);

  const handleSubmit = async () => {
    try {
      if (role === "rider") {
        await API.post("/onboarding/rider", riderDocs);
        navigate("/rider/dashboard", { state: { showTutorial: true } });
      } else {
        await API.post("/onboarding/vendor", vendorDocs);
        navigate("/vendor/dashboard", { state: { showTutorial: true } });
      }
    } catch (err) {
      alert("Submission failed: " + err.message);
    }
  };

  // ---------- JSX ----------
  return (
    <div className="max-w-xl mx-auto p-4">
      {role === "rider" && (
        <>
          <IdentityStep role="rider" docs={riderDocs} setDocs={setRiderDocs} step={step} />
          <PassportStep docs={riderDocs} setDocs={setRiderDocs} step={step} cameraActive={cameraActive} setCameraActive={setCameraActive} videoRef={videoRef} />
          <VehicleStep docs={riderDocs} setDocs={setRiderDocs} step={step} />
        </>
      )}
      {role === "vendor" && (
        <>
          <IdentityStep role="vendor" docs={vendorDocs} setDocs={setVendorDocs} step={step} />
          <CACStep docs={vendorDocs} setDocs={setVendorDocs} step={step} />
          <ShopCityStep docs={vendorDocs} setDocs={setVendorDocs} step={step} />
          <ShopPhotoStep docs={vendorDocs} setDocs={setVendorDocs} step={step} />
        </>
      )}

      {/* Navigation Buttons */}
      <div className="mt-4 flex justify-between">
        {step > 1 && <button onClick={() => setStep(step - 1)} className="btn">Previous</button>}
        {((role === "rider" && step < 3) || (role === "vendor" && step < 4)) && (
          <button onClick={handleNextStep} className="btn" disabled={!canProceed()}>Next</button>
        )}
        {((role === "rider" && step === 3) || (role === "vendor" && step === 4)) && (
          <button onClick={handleSubmit} className="btn" disabled={!canProceed()}>Submit</button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
