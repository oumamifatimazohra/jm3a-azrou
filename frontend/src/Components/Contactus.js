import React, { useEffect, useState } from 'react';
import { GetContries, IpAddress, SendEmail } from '../API';
import InlineError from '../componentss/InlineError';
import Loading from '../componentss/Loading';
import {
  validateEmail,
  validateFullName,
  validateMessage,
  validatePhone,
} from '../componentss/Validation';
import { toast } from 'react-toastify';
import Toast from '../componentss/Toast';
import '../Styles/main.css';
import { useTranslation } from 'react-i18next';

const InputClass =
  'w-full py-4 placeholder:text-gray px-6 text-green-600 border-2 mt-2 border-border border-gray rounded-md';

function Contactus() {
  const [ t, i18n ] = useTranslation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState();
  const [message, setMessage] = useState('');
  const [fullNameError, setFullNameError] = useState();
  const [emailError, setEmailError] = useState();
  const [phoneError, setPhoneError] = useState();
  const [messageError, setMessageError] = useState();
  const [loading, setLoading] = useState(true);
  const [ipData, setIpData] = useState();
  const [countries, setCountries] = useState();
  const [country, setCountry] = useState('Morocco');
  const [buttonLoading, setButtonLoading] = useState(false);
  const [send, setSend] = useState();

  let result = countries && Object.keys(countries).map((key) => countries[key]);
  let output = result && result.find((x) => x.country_name === country);
  let outputResult = output && output.dialling_code;
  let phoneFull = outputResult && outputResult.concat(phone);

  useEffect(() => {
    if (!ipData & !countries) {
      IpAddress({ setLoading, setIpData });
      GetContries({ setLoading, setCountries });
    }
    // *********** VALIDATION **********
    validateFullName({ fullName, setFullNameError });
    validateEmail({ email, setEmailError });
    validatePhone({ phone, setPhoneError });
    validateMessage({ message, setMessageError });
     console.log(countries)
    // ***********
    if (send) {
      toast.success(send.msg);
      setFullName("")
      setEmail("")
      setMessage("")
      setSend()
      setPhone("")
    }
  }, [fullName, email, phone, message, send, ipData, countries]);

  const submitHandler = (e) => {
    e.preventDefault();
    setButtonLoading(true);
    if (!fullNameError & !emailError & !phoneError & !messageError) {
      SendEmail({ fullName, email, phone: phoneFull, message, setSend }).then(
        () => {
          setButtonLoading(false);
        }
      );
    }
  };

  return (
    <div>
      <Toast />
      <div >
        {loading ? (
          <Loading />
        ) : (
          <div className="main-box lg:w-3/4 w-full flex box-shadow rounded-lg overflow-hidden">
          
            <form
              onSubmit={submitHandler}
              className="box-2 bg-white pt-12 pb-6 sm:px-100 px-6 "
            >
            <div className='formcontent'>
            <h2 className="sm:text-2xl text-xl text-center mb-12 font-semibold">
             {t('Contactez-Nous')}
          </h2>
          {/* fullName */}
          <div className="my-6">
            <label> {t('Nom complet')}</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              type="text"
              placeholder="User Doe"
              className={InputClass}
            />
            {fullNameError && <InlineError error={fullNameError} />}
          </div>
          {/* email */}
          <div className="my-6">
            <label>{t('Email')}</label>
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="example@gmail.com"
              className={InputClass}
            />
            {emailError && <InlineError error={emailError} />}
          </div>
          {/* phone */}
          <div className="my-6">
          <label>Phone</label>
          <div className="grid gap-3 grid-cols-12 border-2 mt-2 border-border border-gray rounded-md w-full px-2">
            <input
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="number"
              placeholder="0765452312"
              className="placeholder:text-gray text-black border-gray col-span-7 px-3"
            />
          </div>
          {phoneError && <InlineError error={phoneError} />}
        </div>
          {/* message */}
          <div className="my-6">
            <label>{t('Message')}</label>
            <textarea
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Comment pouvons-nous vous aider?"
              rows={3}
              className="mt-2 w-full border-2 border-border border-gray py-4 placeholder:text-gray px-6 text-black rounded-md"
            />
            {messageError && <InlineError error={messageError} />}
          </div>
          {/* submit */}
          <button
            type="submit"
            disabled={buttonLoading && true}
            className="w-full border-2 border-white hover:bg-green-600 trans bg-green-600 mt-6 rounded-md tracking-widest py-4 font-subMain font-bold"
          >
          {(buttonLoading) ? ('Loading..') : (t('ENVOYER'))}
          </button>
        
            </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Contactus;
