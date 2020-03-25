var GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzjdBkin__TxFXPKbA6tENz6BAT6FQx4-3lFs6A0Xk8Ifm1DdU/exec';

function setMentor(mentor) {
  document.querySelector('#mentor_input').value = mentor;
}

function padNumber(num, size) {
  var s = num+"";
  while (s.length < size) s = "0" + s;
  return s;
}

function serializeToQuery(data) {
  return '?' + Object.keys(data).map(function(name) {
    var value = data[name];
    return name + '=' + encodeURI(value);
  }).join('&');
}

function ajaxGET(url, callback, errorHandler) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState !== 4) return;
    if (this.status >= 200 && this.status < 300 && callback) {
      try {
        callback(JSON.parse(this.responseText));
      } catch (e) {
        callback(this.response);
      }
    } else if (callback && errorHandler) {
      errorHandler(this)
    }
  };
  xhr.open('GET', url, true);
  xhr.send();
}

function getFormattedDate(date) {
  if (!date) {
    date = new Date();
  }
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();
  var hour = padNumber(date.getHours(),2);
  var minute = padNumber(date.getMinutes(),2);
  var second = padNumber(date.getSeconds(),2);
  return `${day}.${month}.${year} ${hour}:${minute}:${second}`;
}

function sendBookingData(e) {
  e.preventDefault();
  var form = e.target;
  var data = {};
  Array.from(form.querySelectorAll('input, textarea')).forEach(function(e) {
    data[e.name] = e.value
  });
  data.date = getFormattedDate();
  beforeBookingSend(e);
  ajaxGET(GOOGLE_SCRIPT_URL + serializeToQuery(data), handleBookingSuccess, handleBookingError);
}

function handleBookingSubmit() {
  var form = document.querySelector('#booktime form');
  if (!form) {
    return;
  }
  if (form.addEventListener) {
    form.addEventListener('submit', sendBookingData, false);
  } else if (form.attachEvent) {
    form.attachEvent('onsubmit', sendBookingData);
  }
}
  
handleBookingSubmit();


function beforeBookingSend(event) {
  //do some stuff before sending
}
function handleBookingSuccess(response) {
  alert('successfully send');
  //do some after successful sending
}


function handleBookingError(response) {
  //do some stuff after getting error
}