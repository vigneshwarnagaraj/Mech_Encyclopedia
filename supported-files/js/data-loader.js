// ===================== DATA LOADER =====================
// Utility to load JSON data files from supported-files/data/
// Pages can call MechData.load('constants') to get the data.

window.MechData = (function () {
  var cache = {};
  var BASE  = 'supported-files/data/';

  function load(name, callback) {
    if (cache[name]) {
      if (typeof callback === 'function') callback(null, cache[name]);
      return Promise.resolve(cache[name]);
    }
    return fetch(BASE + name + '.json')
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        cache[name] = data;
        if (typeof callback === 'function') callback(null, data);
        return data;
      })
      .catch(function (err) {
        console.error('[DataLoader] Failed to load:', name, err);
        if (typeof callback === 'function') callback(err, null);
        return null;
      });
  }

  return { load: load };
})();