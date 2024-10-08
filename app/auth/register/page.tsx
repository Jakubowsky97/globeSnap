"use client";
import { useState } from "react";
import { useCreateUserWithEmailAndPassword, useSignInWithFacebook, useSignInWithGoogle } from "react-firebase-hooks/auth";
import {auth} from "@/app/firebase/config";
import { useRouter } from "next/navigation";

 
export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
  const [signInWithFacebook] = useSignInWithFacebook(auth);
  const [signInWithGoogle] = useSignInWithGoogle(auth);

  const handleSignUp = async() => {
    try {
      const res = createUserWithEmailAndPassword(email, password);
      console.log({res});
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error(err);
    }
  }

  const handleSignInWithFacebook = async() => { 
    try {
      // Poczekaj na zakończenie logowania
      const res = await signInWithFacebook();
  
      // Gdy logowanie zakończy się sukcesem, uzyskaj dostęp do obiektu user
      if (res) {
        const user = res.user; // Pobierz obiekt użytkownika
        const email = user.email!; // Pobierz email zalogowanego użytkownika
  
        console.log("Zalogowano pomyślnie:", user);
  
        // Zapisz email użytkownika do sessionStorage
        sessionStorage.setItem('user', email);
  
        // Wyczyść pola formularza
        setEmail('');
        setPassword('');
  
        // Przekieruj użytkownika na stronę główną (lub inną)
        router.push("/");
      }
    } catch (err) {
      // Obsłuż błąd w przypadku, gdy coś pójdzie nie tak
      console.error("Błąd logowania:", err);
    }
  }

  const handleSignInWithGoogle = async () => {
    try {
      // Poczekaj na zakończenie logowania
      const res = await signInWithGoogle();
  
      // Gdy logowanie zakończy się sukcesem, uzyskaj dostęp do obiektu user
      if (res) {
        const user = res.user; // Pobierz obiekt użytkownika
        const email = user.email!; // Pobierz email zalogowanego użytkownika
  
        console.log("Zalogowano pomyślnie:", user);
  
        // Zapisz email użytkownika do sessionStorage
        sessionStorage.setItem('user', email);
  
        // Wyczyść pola formularza
        setEmail('');
        setPassword('');
  
        // Przekieruj użytkownika na stronę główną (lub inną)
        router.push("/");
      }
    } catch (err) {
      // Obsłuż błąd w przypadku, gdy coś pójdzie nie tak
      console.error("Błąd logowania:", err);
    }
  };
  
  


  return (
    <>
      <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-200 border-0">
              <div className="rounded-t mb-0 px-6 py-6">
                <div className="text-center mb-3">
                  <h6 className="text-gray-500 text-sm font-bold">
                    Sign up with
                  </h6>
                </div>
                <div className="btn-wrapper text-center">
                  <button
                    className="bg-white active:bg-gray-50 text-gray-700 px-4 py-2 rounded outline-none focus:outline-none mr-2 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150"
                    type="button"
                    onClick={handleSignInWithFacebook}
                  >
                    <img
                      alt="..."
                      className="w-5 mr-1"
                      src="/img/facebook.svg"
                    />
                    Facebook
                  </button>
                  <button
                    className="bg-white active:bg-gray-50 text-gray-700 px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150"
                    type="button"
                    onClick={handleSignInWithGoogle}
                  >
                    <img
                      alt="..."
                      className="w-5 mr-1"
                      src="/img/google.svg"
                    />
                    Google
                  </button>
                </div>
                <hr className="mt-6 border-b-1 border-gray-300" />
              </div>
              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <div className="text-gray-400 text-center mb-3 font-bold">
                  <small>Or sign up with credentials</small>
                </div>
                <form>
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-gray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Name
                    </label>
                    <input
                      type="email"
                      className="border-0 px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Name"
                    />
                  </div>

                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-gray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-0 px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Email"
                    />
                  </div>

                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-gray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-0 px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Password"
                    />
                  </div>

                  <div>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        id="customCheckLogin"
                        type="checkbox"
                        className="form-checkbox border-0 rounded text-gray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                      />
                      <span className="ml-2 text-sm font-semibold text-gray-600">
                        I agree with the{" "}
                        <a
                          href="#pablo"
                          className="text-lightBlue-500"
                          onClick={(e) => e.preventDefault()}
                        >
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                  </div>

                  <div className="text-center mt-6">
                    <button
                      className="bg-gray-800 text-white active:bg-gray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                      type="button"
                      onClick={handleSignUp}
                    >
                      Create Account
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
