"use client";
import React, { useState } from "react";
//componentes
import {
  WelcomeMessage,
  WelcomeMessageLogin,
} from "../../Components/WelcomeMessage/WelcomeMessage";

import { validateRegisterForm, validateLoginForm } from "./formValidation";

//redux
import { useCreateUserMutation } from "@/redux/services/usersApi";
import { useLoginUserMutation } from "@/redux/services/usersApi";
import {loginUser} from "@/redux/features/userSlice"
import { useDispatch } from 'react-redux';
import { signIn } from "next-auth/react";

//iconos
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaGoogle } from "react-icons/fa";
import { faUser, faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import  { toast, Toaster } from 'react-hot-toast';
const envelopeIcon = <FontAwesomeIcon icon={faEnvelope} />;
const userIcon = <FontAwesomeIcon icon={faUser} />;
const lockIcon = <FontAwesomeIcon icon={faLock} />;

const Register = () => {
  /*   const [authenticated, setAuthenticated] = useState(false); */

  const dispatch = useDispatch()
  //estado para la creacion de usuarios
  const [newUser] = useCreateUserMutation();
  //estado para el login
  const [login] = useLoginUserMutation();
  //estado para las validaciones
  const [formErrors, setFormErrors] = useState({});

  const [showRegisterForm, setShowRegisterForm] = useState(true);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  //estado para mensaje de bienvenida Registro
  const [welcomeMessage, setWelcomeMessage] = useState("");
  //estado para mensaje de bienvenida Login
  const [welcomeMessageLogin, setWelcomeMessageLogin] = useState("");

  //estado para el form de registro
  const [registerFormData, setRegisterFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    password: "",
  });
  //estado para el form de login
  const [loginFormData, setLoginFormData] = useState({
    loginEmail: "",
    loginPassword: "",
  });
  //funcion para ocultar la contraseña
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  // funcion para la vista del login
  const showLoginFormView = () => {
    setShowLoginForm(true);
    setShowRegisterForm(false);
  };
  // funcion para la vista del registro
  const showRegisterFormView = () => {
    setShowLoginForm(false);
    setShowRegisterForm(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (showRegisterForm) {
      setRegisterFormData({
        ...registerFormData,
        [name]: value,
      });
    } else {
      setLoginFormData({
        ...loginFormData,
        [name]: value,
      });
    }
  };

  //funcion para validaciones de los formularios
  const validateForm = () => {
    const formData = showRegisterForm ? registerFormData : loginFormData;
    const errors = showRegisterForm
      ? validateRegisterForm(formData)
      : validateLoginForm(formData);

    // Manejo de errores y lógica de formulario inválido

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
  
    if (validateForm()) {
      try {
        const response = await newUser(registerFormData);
        console.log("esto es response ", response);
  
        if (response.error && response.error.data && response.error.data.error) {
          toast.error("Este correo electronico ya existe");
        } else {
          
          const { name, email, password } = registerFormData;
          setWelcomeMessage(`Hola ${name}!`);
  
          try {
            const loginResponse = await login({ loginEmail: email, loginPassword: password });
  
            if (loginResponse?.data?.token) {
              const { user } = loginResponse.data;
              const userName = user.name;
              setWelcomeMessageLogin(`¡Hola de nuevo ${userName}!`);
              dispatch(loginUser(loginResponse.data));
            } else {
              console.error("Error en el inicio de sesión:", loginResponse?.data?.error);
            }
  
            setLoginFormData({
              loginEmail: "",
              loginPassword: "",
            });
          } catch (error) {
            console.error("Error al iniciar sesión automáticamente:", error);
          }
        }
      } catch (error) {
        console.error("Error al registrar el usuario:", error);
      }
    } else {
      console.log("Formulario de registro inválido");
    }
  };
  

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
  
    if (validateForm()) {
      try {
        const response = await newUser(registerFormData);
        console.log("esto es response ", response);
  
        if (response.error && response.error.data && response.error.data.error) {
          toast.error("Usuario inválido");
        } else {
          try {
            const loginResponse = await login({
              loginEmail: registerFormData.email,
              loginPassword: registerFormData.password,
            });
  
            console.log("loginResponse", loginResponse); // Agrega este log para entender la estructura de loginResponse
  
            if (loginResponse?.data?.token) {
              // La autenticación fue exitosa
              const { user } = loginResponse.data;
              const userName = user.name;
              setWelcomeMessageLogin(`¡Hola de nuevo ${userName}!`);
              dispatch(loginUser(loginResponse.data));
            } else {
              console.error(
                "Error en el inicio de sesión:",
                loginResponse?.data?.error
              );
              // Puedes manejar el error de inicio de sesión aquí
            }
  
            // Limpia el formulario de inicio de sesión
            setLoginFormData({
              loginEmail: "",
              loginPassword: "",
            });
          } catch (error) {
            console.error("Error al iniciar sesión:", error);
          }
        }
      } catch (error) {
        console.error("Error al registrar el usuario:", error);
        toast.error('Usuario inválido', {
          style: {
            background: 'red',
            color: 'white',
          },
        });
      }
    } else {
      console.log("Formulario de inicio de sesión inválido");
    }
  };
  
  
  return (
    <div className="min-h-screen ml-48 flex items-center justify-center ">
      <div className="bg-white p-4 rounded shadow-xl w-96 flex flex-col">
        {showRegisterForm ? (
          <>
            <h1 className="text-2xl font-bold mb-4 text-center font-serif  mx-auto mt-4 mb-4">
              Registrarse
            </h1>
            <form onSubmit={handleRegisterSubmit}>
              {/* Nombre */}
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-gray-700 text-sm font-semibold mb-2"
                >
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Nombre"
                  value={registerFormData.name}
                  onChange={handleChange}
                  className={`transition-all duration-300 ease-in-out transform scale-100 hover:scale-105 mr-10 bg-gray-50 border border-gray-300 text-black-500 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-teal-500 dark:focus:border-teal-500`}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                )}
              </div>
              {/* Apellido */}
              <div className="mb-4">
                <label
                  htmlFor="lastname"
                  className="block text-gray-700 text-sm font-semibold mb-2"
                >
                  Apellido
                </label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  placeholder="Apellido"
                  value={registerFormData.lastname}
                  onChange={handleChange}
                  className={`transition-all duration-300 ease-in-out transform scale-100 hover:scale-105 mr-10 bg-gray-50 border border-gray-300 text-black-500 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-teal-500 dark:focus:border-teal-500`}
                />
                {formErrors.lastname && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.lastname}
                  </p>
                )}
              </div>
              {/* Correo Electrónico */}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-gray-700 text-sm font-semibold mb-2"
                >
                  {envelopeIcon} Correo Electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  value={registerFormData.email}
                  onChange={handleChange}
                  className={`transition-all duration-300 ease-in-out transform scale-100 hover:scale-105 mr-10 bg-gray-50 border border-gray-300 text-black-500 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-teal-500 dark:focus:border-teal-500`}
                />
                {formErrors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>
              {/* Contraseña */}
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-gray-700 text-sm font-semibold mb-2"
                >
                  {lockIcon} Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Contraseña"
                    value={registerFormData.password}
                    onChange={handleChange}
                    className={`transition-all duration-300 ease-in-out transform scale-100 hover:scale-105 mr-10 bg-gray-50 border border-gray-300 text-black-500 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-teal-500 dark:focus:border-teal-500`}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.password}
                  </p>
                )}
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  className="transition-all duration-300 ease-in-out transform scale-100 hover:scale-105 w-full bg-teal-500 text-white rounded px-4 py-2 hover:bg-red-600 focus:outline-none"
                >
                  Registrarse
                </button>
              </div>
              <Toaster position="top-center"/>
            </form>

            <div className="mt-2 flex flex-col">
              <h1 className="mt-2">¿Ya tienes una cuenta?</h1>
              <button
                className=" transition-all duration-300 ease-in-out transform scale-100 hover:scale-105 mt-2 bg-red-500 text-white rounded px-4 py-2 hover:bg-red-800 focus:outline-none"
                onClick={showLoginFormView}
              >
                {userIcon} Iniciar sesión
              </button>
              {welcomeMessage && <WelcomeMessage message={welcomeMessage} />}
            </div>
          </>
        ) : null}

        {showLoginForm ? (
          <>
            <h1 className=" text-2xl font-semibold mb-2">
              {userIcon} Iniciar sesión
            </h1>
            <form onSubmit={handleLoginSubmit}>
              {/* Correo Electrónico para inicio de sesión */}
              <div className="mb-4 mt-4">
                <label
                  htmlFor="loginEmail"
                  className="block text-gray-700 text-sm font-semibold mb-2"
                >
                  {envelopeIcon} Correo Electrónico
                </label>
                <input
                  type="email"
                  id="loginEmail"
                  name="loginEmail"
                  placeholder="Email"
                  value={loginFormData.loginEmail}
                  onChange={handleChange}
                  className={`transition-all duration-300 ease-in-out transform scale-100 hover:scale-105 mr-10 bg-gray-50 border border-gray-300 text-black-500 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-teal-500 dark:focus:border-teal-500`}
                />
                {formErrors.loginEmail && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.loginEmail}
                  </p>
                )}
              </div>

              {/* Contraseña */}
              <div className="mb-4">
                <label
                  htmlFor="loginPassword"
                  className="block text-gray-700 text-sm font-semibold mb-2"
                >
                  {lockIcon} Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="loginPassword"
                    name="loginPassword"
                    placeholder="Contraseña"
                    value={loginFormData.loginPassword}
                    onChange={handleChange}
                    className={`transition-all duration-300 ease-in-out transform scale-100 hover:scale-105 mr-10 bg-gray-50 border border-gray-300 text-black-500 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-teal-500 dark:focus:border-teal-500`}
                  />
                  <button
                    type="button"
                    className="transition-all duration-300 ease-in-out transform scale-100 hover:scale-105 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
                {formErrors.loginPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.loginPassword}
                  </p>
                )}
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  className=" transition-all duration-300 ease-in-out transform scale-100 hover:scale-105 w-full bg-teal-500 text-white rounded px-4 py-2 hover:bg-red-600 focus:outline-none"
                >
                  Ingresar
                </button>
                <button
                  type="button"
                  onClick={async ()=> {
                    signIn('google');
                  }}
                  className=" transition-all duration-300 ease-in-out transform scale-100 hover:scale-105 flex items-center justify-center w-full h-8 bg-red-500 hover:bg-red-800 text-white px-4 py-2 rounded focus:outline-none focus:border-teal-300 duration-200 mt-2"
                >
                  <FaGoogle className="mr-2" />
                  Accede con Google
                </button>
                <Toaster position="top-center"/>
              </div>
            </form>
            <div className="mt-2 text-center">
              <h1 className="text-sm text-gray-600 mb-2 mt-2">
                ¿No tienes cuenta?{" "}
              </h1>
              <button
                className="transition-all duration-300 ease-in-out transform scale-100 hover:scale-105 bg-teal-800 text-white rounded px-4 py-2 hover:bg-red-800 focus:outline-none"
                onClick={showRegisterFormView}
              >
                Regístrate
              </button>
            </div>
            {welcomeMessageLogin && (
              <WelcomeMessageLogin message={welcomeMessageLogin} />
            )}
          </>
        ) : null}
      </div>
      <div className="min-h-screen mt-12 mb-48 flex items-center justify-center "></div>
      <div className="bg-white p-8 rounded shadow-xl w-96 flex flex-col ml-32 font-serif text-lg font-thin mb-32">
        <h1 className="text-2xl font-bold mb-4 text-center font-serif ">
          Registro
        </h1>
        Registrarte en este sitio te permite acceder al estado e historial de tu
        pedido. Simplemente completa los campos a continuación y configuremos
        una nueva cuenta para ti en un abrir y cerrar de ojos. Solo te pediremos
        la información necesaria para que el proceso de compra sea más rápido y
        sencillo.
      </div>
     
    </div>
  );
};

export default Register;
