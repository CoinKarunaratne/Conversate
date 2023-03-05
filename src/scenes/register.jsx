import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { motion } from "framer-motion";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";
import { useDispatch } from "react-redux";
import { setUser } from "../state";
import { useNavigate } from "react-router-dom";
import { db } from "../config/firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

export default function register() {
  const [register, isRegister] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userRef = collection(db, "users");

  const registerSchema = yup.object().shape({
    Name: yup.string().required("Required"),
    email: yup
      .string()
      .email("Please enter a valid email")
      .required("Required"),
    password: yup.string().min(6).required("Required"),
  });

  const loginSchema = yup.object().shape({
    email: yup
      .string()
      .email("Please enter a valid email")
      .required("Required"),
    password: yup.string().min(6).required("Required"),
  });

  const registerInitial = {
    Name: "",
    email: "",
    password: "",
  };

  const loginInitial = {
    email: "",
    password: "",
  };

  const signIn = async (values, onSubmitProps) => {
    try {
      await createUserWithEmailAndPassword(auth, values.email, values.password);
      await updateProfile(auth.currentUser, {
        displayName: values.Name,
      });

      onSubmitProps.resetForm();

      const { uid, displayName, photoURL } = auth.currentUser;
      await addDoc(userRef, {
        uid,
        displayName,
        photoURL,
      });
      await dispatch(
        setUser({
          user: {
            uid,
            displayName,
            photoURL,
          },
        })
      );
      navigate("/home");
    } catch (err) {
      console.log(err);
      alert("Please Login if you already have an account");
    }
  };

  const googleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      const { uid, displayName, photoURL } = auth.currentUser;
      const userExistsQuery = query(userRef, where("uid", "==", uid));
      const userExistsSnapshot = await getDocs(userExistsQuery);
      if (userExistsSnapshot.empty) {
        await addDoc(userRef, {
          uid,
          displayName,
          photoURL,
        });
      }
      await dispatch(
        setUser({
          user: {
            uid,
            displayName,
            photoURL,
          },
        })
      );
      navigate("/home");
    } catch (err) {
      console.log(err);
    }
  };

  const login = async (values, onSubmitProps) => {
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      onSubmitProps.resetForm();
      const { uid, displayName, photoURL } = auth.currentUser;
      await dispatch(
        setUser({
          user: {
            uid,
            displayName,
            photoURL,
          },
        })
      );
      navigate("/home");
    } catch (err) {}
  };

  const onSubmit = async (values, onSubmitProps) => {
    if (register) await signIn(values, onSubmitProps);
    if (!register) await login(values, onSubmitProps);
  };

  const formik = useFormik({
    initialValues: register ? registerInitial : loginInitial,
    validationSchema: register ? registerSchema : loginSchema,
    onSubmit,
  });

  return (
    <div className="flex bg-sky-900 min-h-screen">
      <div className="flex flex-col justify-center w-full">
        <h1
          className={`font-semibold text-[30px] text-white text-center mb-[80px]`}
        >
          {register ? "Join the Conversate" : "Log in to Your Account"}
        </h1>
        <div className="mx-auto w-auto sm:w-[600px] glass">
          <form
            onSubmit={formik.handleSubmit}
            className="w-[100%] my-0 px-10 pt-5"
          >
            {register ? (
              <>
                <label
                  className="text-[1rem] font-bold block text-left my-[0.5rem] text-white"
                  htmlFor="Name"
                >
                  Name
                </label>
                <input
                  id="Name"
                  type="text"
                  className={`${
                    formik.errors.firstName &&
                    formik.touched.firstName &&
                    "error"
                  } mb-[0.5rem] w-[100%] py-[0.65rem] px-[1rem] text-[1rem] text-white border-solid border-[#4a5568] bg-[#2d3748] rounded-[10px] border-[2px] focus:border-[#4299e1] outline-none placeholder:text-[#a0aec0]`}
                  placeholder="Enter your Name"
                  value={formik.values.Name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.Name && formik.touched.Name && (
                  <p className="text-[#fc8181] text-[0.75rem] text-left">
                    {formik.errors.Name}
                  </p>
                )}

                <label
                  className="text-[1rem] font-bold block text-left my-[0.5rem] text-white"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className={`${
                    formik.errors.email && formik.touched.email && "error"
                  } mb-[0.5rem] w-[100%] py-[0.65rem] px-[1rem] text-[1rem] text-white border-solid border-[#4a5568] bg-[#2d3748] rounded-[10px] border-[2px] focus:border-[#4299e1] outline-none placeholder:text-[#a0aec0]`}
                  placeholder="Enter your Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.email && formik.touched.email && (
                  <p className="text-[#fc8181] text-[0.75rem] text-left">
                    {formik.errors.email}
                  </p>
                )}
                <label
                  className="text-[1rem] font-bold block text-left my-[0.5rem] text-white"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className={`${
                    formik.errors.password && formik.touched.password && "error"
                  } mb-[0.5rem] w-[100%] py-[0.65rem] px-[1rem] text-[1rem] text-white border-solid border-[#4a5568] bg-[#2d3748] rounded-[10px] border-[2px] focus:border-[#4299e1] outline-none placeholder:text-[#a0aec0]`}
                  placeholder="Enter your Password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.password && formik.touched.password && (
                  <p className="text-[#fc8181] text-[0.75rem] text-left">
                    {formik.errors.password}
                  </p>
                )}
              </>
            ) : (
              <>
                {" "}
                <label
                  className="text-[1rem] font-bold block text-left my-[0.5rem] text-white"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className={`${
                    formik.errors.email && formik.touched.email && "error"
                  } mb-[0.5rem] w-[100%] py-[0.65rem] px-[1rem] text-[1rem] text-white border-solid border-[#4a5568] bg-[#2d3748] rounded-[10px] border-[2px] focus:border-[#4299e1] outline-none placeholder:text-[#a0aec0]`}
                  placeholder="Enter your Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.email && formik.touched.email && (
                  <p className="text-[#fc8181] text-[0.75rem] text-left">
                    {formik.errors.email}
                  </p>
                )}
                <label
                  className="text-[1rem] font-bold block text-left my-[0.5rem] text-white"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className={`${
                    formik.errors.password && formik.touched.password && "error"
                  } mb-[0.5rem] w-[100%] py-[0.65rem] px-[1rem] text-[1rem] text-white border-solid border-[#4a5568] bg-[#2d3748] rounded-[10px] border-[2px] focus:border-[#4299e1] outline-none placeholder:text-[#a0aec0]`}
                  placeholder="Enter your Password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.password && formik.touched.password && (
                  <p className="text-[#fc8181] text-[0.75rem] text-left">
                    {formik.errors.password}
                  </p>
                )}
              </>
            )}
            <motion.button
              whileTap={{ scale: 0.8 }}
              whileHover={{ scale: 0.95 }}
              disabled={formik.isSubmitting}
              className="disabled:opacity-[0.35] block mt-[2rem] mb-[0.5rem] mx-0 py-[0.35rem] px-[0.5rem] bg-[#4299e1] text-[#1a202c] border-none rounded-[3px] w-[100%] text-[1rem] font-bold cursor-pointer"
              type="submit"
            >
              {register ? "Register" : "Login"}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.8 }}
              whileHover={{ scale: 0.95 }}
              disabled={formik.isSubmitting}
              onClick={() => googleSignIn()}
              className="disabled:opacity-[0.35] block mt-[1rem] mb-[0.5rem] mx-0 py-[0.35rem] px-[0.5rem] bg-green-500 text-[#1a202c] border-none rounded-[3px] w-[100%] text-[1rem] font-bold cursor-pointer"
              type="button"
            >
              Sign in using Google
            </motion.button>
            <motion.p
              whileTap={{ scale: 0.9 }}
              className="cursor-pointer underline text-sky-200 hover:text-sky-300 text-center mb-[2rem]"
              onClick={() => {
                isRegister((state) => !state);
                formik.resetForm();
              }}
            >
              {register
                ? "Already have an account? Login here."
                : "Don't have an account? Sign Up here."}
            </motion.p>
          </form>
        </div>
      </div>
    </div>
  );
}
