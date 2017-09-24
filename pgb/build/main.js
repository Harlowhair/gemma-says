webpackJsonp([0],{

/***/ 24:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 24;

/***/ }),

/***/ 27:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 27;

/***/ }),

/***/ 33:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

// EXTERNAL MODULE: ./node_modules/@angular/platform-browser-dynamic/@angular/platform-browser-dynamic.es5.js + 1 modules
var platform_browser_dynamic_es5 = __webpack_require__(34);

// EXTERNAL MODULE: ./node_modules/@angular/core/@angular/core.es5.js
var core_es5 = __webpack_require__(0);

// EXTERNAL MODULE: ./node_modules/@angular/http/@angular/http.es5.js
var http_es5 = __webpack_require__(25);

// EXTERNAL MODULE: ./node_modules/@angular/platform-browser/@angular/platform-browser.es5.js
var platform_browser_es5 = __webpack_require__(2);

// EXTERNAL MODULE: ./node_modules/ionic-angular/index.js + 195 modules
var ionic_angular = __webpack_require__(5);

// EXTERNAL MODULE: ./node_modules/@ionic/storage/es2015/index.js + 1 modules
var es2015 = __webpack_require__(10);

// EXTERNAL MODULE: ./node_modules/@ionic-native/status-bar/index.js
var status_bar = __webpack_require__(28);

// EXTERNAL MODULE: ./node_modules/@ionic-native/splash-screen/index.js
var splash_screen = __webpack_require__(29);

// EXTERNAL MODULE: ./node_modules/@ionic-native/file-transfer/index.js
var file_transfer = __webpack_require__(30);

// EXTERNAL MODULE: ./node_modules/@ionic-native/file/index.js
var file = __webpack_require__(31);

// CONCATENATED MODULE: ./src/services/cache.service.ts
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var CacheService = (function () {
    function CacheService(storage, transfer, file, platform) {
        var _this = this;
        this.storage = storage;
        this.transfer = transfer;
        this.file = file;
        this.platform = platform;
        this._cache = [];
        this.maxCachedDays = 7;
        /* When storage is ready, load cache into memory
         * After loading the cache into the memory, this service is ready
         */
        this._ready = new Promise(function (resolve, reject) {
            _this.platform.ready()
                .then(function () {
                _this.fileTransfer = _this.transfer.create();
                return _this.storage.ready()
                    .then(function () {
                    return _this.storage.forEach(function (value, key) {
                        if (key.startsWith('cache:')) {
                            _this.getCache().push(value);
                            /* If the sound is outdated, remove it */
                            if (_this.isOutdated(value)) {
                                _this.removeFromCache(value)
                                    .catch(function (error) { return reject(error); });
                            }
                        }
                    });
                });
            })
                .then(function () { return resolve(); })
                .catch(function (error) { return reject(error); });
        });
    }
    CacheService.prototype.ready = function () {
        return this._ready;
    };
    CacheService.prototype.clearCache = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            /* Loops through the entire cache and remove all entries by
             * calling this.removeFromCache for each of them.
             * This loop is back to front because there would be
             * async issues when looping front to back
             */
            for (var i = _this.getCache().length - 1; i >= 0; i--) {
                var sound = _this.getCache()[i];
                _this.removeFromCache(sound)
                    .then(function () {
                    /* Resolve when all sounds have been removed */
                    if (_this.getCache().length === 0) {
                        return resolve();
                    }
                })
                    .catch(function (error) { return reject(error); });
            }
            /* Also resolve if cache already was empty */
            return resolve();
        });
    };
    /* Checks if sound with the same name already exists in cache */
    CacheService.prototype.hasInCache = function (sound) {
        return this.getCache().findIndex(function (cachedSound) { return cachedSound.title === sound.title; }) > -1;
    };
    /* Downloads a file into the local data directory, adding the sound object
     * to the cache storage as well.
     */
    CacheService.prototype.addToCache = function (sound) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            /* Resolve with existing sound if it is already present and not outdated,
             * set src property to the remote one if it is outdated, so it will get
             * replaced
             */
            if (_this.hasInCache(sound)) {
                if (!_this.isOutdated(sound)) {
                    return resolve(_this.getFromCache(sound));
                }
                if (sound.remoteSrc) {
                    sound.src = sound.remoteSrc;
                }
            }
            /* Download file at sound.src into the local data directory */
            _this.fileTransfer.download(sound.src, _this.file.dataDirectory + sound.title)
                .then(function (entry) {
                /* Media plugin can't play sounds with 'file://' prefix on ios */
                var src = entry.toURL();
                if (_this.platform.is('ios')) {
                    src = src.replace(/^file:\/\//, '');
                }
                var cachedSound = {
                    title: sound.title,
                    src: src,
                    remoteSrc: sound.src,
                    cacheDate: new Date()
                };
                return _this.storage.set('cache:' + cachedSound.title, cachedSound)
                    .then(function () {
                    _this.getCache().push(cachedSound);
                    return resolve(cachedSound);
                });
            })
                .catch(function (error) { return reject(error); });
        });
    };
    /* Removes sound from local data directory and cache storage */
    CacheService.prototype.removeFromCache = function (sound) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var index = _this.getCache().findIndex(function (cachedSound) { return cachedSound.title === sound.title; });
            if (index === -1) {
                return reject('Not in cache');
            }
            /* Remove the sound from memory */
            _this.getCache().splice(index, 1);
            /* Remove the sound from cache storage */
            _this.storage.remove('cache:' + sound.title)
                .catch(function (error) { return reject(error); });
            /* Remove the sound from filesystem */
            return _this.file.removeFile(_this.file.dataDirectory, sound.title);
        });
    };
    /* Checks if a cached sound needs to be refreshed */
    CacheService.prototype.isOutdated = function (sound) {
        return this.hasInCache(sound) && new Date().getDate() - this.maxCachedDays > this.getFromCache(sound).cacheDate.getDate();
    };
    /* Returns entire cache */
    CacheService.prototype.getCache = function () {
        return this._cache;
    };
    /* Returns a cached sound from cache */
    CacheService.prototype.getFromCache = function (sound) {
        if (!this.hasInCache(sound)) {
            return null;
        }
        return this.getCache()[this.getCache().findIndex(function (cachedSound) { return cachedSound.title === sound.title; })];
    };
    return CacheService;
}());
CacheService = __decorate([
    Object(core_es5["B" /* Injectable */])(),
    __metadata("design:paramtypes", [es2015["b" /* Storage */], file_transfer["a" /* FileTransfer */],
        file["a" /* File */], ionic_angular["e" /* Platform */]])
], CacheService);

//# sourceMappingURL=cache.service.js.map
// CONCATENATED MODULE: ./src/services/favourites.service.ts
var favourites_service___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var favourites_service___metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var FavouritesService = (function () {
    function FavouritesService(storage) {
        var _this = this;
        this.storage = storage;
        this._favourites = [];
        /* When storage is ready, load all favourites into the app */
        this._ready = new Promise(function (resolve, reject) {
            return _this.storage.ready()
                .then(function () {
                return _this.storage.get('favourites')
                    .then(function (value) {
                    if (value) {
                        _this._favourites = value;
                    }
                });
            });
        });
    }
    FavouritesService.prototype.ready = function () {
        return this._ready;
    };
    FavouritesService.prototype.clearFavourites = function () {
        this._favourites = [];
        this.storage.set('favourites', this.getAllFavourites());
    };
    /* Checks if sound with name already exists in favourites */
    FavouritesService.prototype.hasFavourite = function (sound) {
        return this.getAllFavourites().findIndex(function (favourite) { return favourite === sound.title; }) > -1;
    };
    /* Adds new sound to favourites and storage */
    FavouritesService.prototype.addFavourite = function (sound) {
        this.getAllFavourites().push(sound.title);
        return this.storage.set('favourites', this.getAllFavourites());
    };
    /* Removes sound from favourites and storage */
    FavouritesService.prototype.removeFavourite = function (sound) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var index = _this.getAllFavourites().findIndex(function (favourite) { return favourite === sound.title; });
            if (index < 0) {
                return reject(sound.title + ' not in favourites');
            }
            _this.getAllFavourites().splice(index, 1);
            return _this.storage.set('favourites', _this.getAllFavourites());
        });
    };
    /* Adds favourite if it didn't exist yet, removes it otherwise */
    FavouritesService.prototype.toggleFavourite = function (sound) {
        if (this.hasFavourite(sound)) {
            return this.removeFavourite(sound);
        }
        else {
            return this.addFavourite(sound);
        }
    };
    /* Returns all favourites */
    FavouritesService.prototype.getAllFavourites = function () {
        return this._favourites;
    };
    return FavouritesService;
}());
FavouritesService = favourites_service___decorate([
    Object(core_es5["B" /* Injectable */])(),
    favourites_service___metadata("design:paramtypes", [es2015["b" /* Storage */]])
], FavouritesService);

//# sourceMappingURL=favourites.service.js.map
// EXTERNAL MODULE: ./node_modules/@ionic-native/media/index.js
var media = __webpack_require__(32);

// CONCATENATED MODULE: ./src/services/media.service.ts
var media_service___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var media_service___metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var MediaService = (function () {
    function MediaService(platform, cordovaMedia, zone) {
        var _this = this;
        this.platform = platform;
        this.cordovaMedia = cordovaMedia;
        this.zone = zone;
        this._ready = new Promise(function (resolve, reject) {
            return _this.platform.ready();
        });
    }
    MediaService.prototype.ready = function () {
        return this._ready;
    };
    /* Plays a sound, stopping other playing sounds if necessary */
    MediaService.prototype.play = function (sound) {
        this.stopPlayback();
        /* Plays with Cordova Audio if available, falls back on Web Audio.
         * If something goes wrong in playing with Cordova Audio, play with
         * Web Audio as well
         */
        if (window.hasOwnProperty('cordova') && window.hasOwnProperty('Media')) {
            try {
                this.playWithCordovaAudio(sound);
            }
            catch (error) {
                if (sound.remoteSrc) {
                    this.playWithWebAudio(sound, sound.remoteSrc);
                }
                else {
                    this.playWithWebAudio(sound);
                }
            }
        }
        else {
            this.playWithWebAudio(sound);
        }
    };
    MediaService.prototype.playWithWebAudio = function (sound, alternativeSrc) {
        if (alternativeSrc === void 0) { alternativeSrc = null; }
        var src = alternativeSrc || sound.src;
        this.media = new Audio(src);
        /* Adding event listeners to update the sound's isPlaying attribute accordingly */
        this.media.onended = function () {
            sound.isPlaying = false;
        };
        this.media.onpause = function () {
            sound.isPlaying = false;
        };
        this.media.onplay = function () {
            sound.isPlaying = true;
        };
        this.media.load();
        this.media.play();
    };
    MediaService.prototype.playWithCordovaAudio = function (sound) {
        var _this = this;
        this.media = this.cordovaMedia.create(sound.src);
        /* Adding status callback to update the sound's isPlaying attribute accordingly */
        this.media.statusCallback = function (status) {
            /* Run this in ngZone to propagate changes to the UI */
            _this.zone.run(function () {
                switch (status) {
                    case _this.cordovaMedia.MEDIA_RUNNING:
                        sound.isPlaying = true;
                        break;
                    case _this.cordovaMedia.MEDIA_PAUSED:
                        sound.isPlaying = false;
                        break;
                    case _this.cordovaMedia.MEDIA_STOPPED:
                        sound.isPlaying = false;
                        break;
                }
            });
        };
        this.media.play();
    };
    /* Stops the playback of the sound */
    MediaService.prototype.stopPlayback = function () {
        if (this.media) {
            if (this.media.release) {
                this.media.stop();
                this.media.release();
            }
            else {
                this.media.pause();
            }
            this.media = null;
        }
    };
    return MediaService;
}());
MediaService = media_service___decorate([
    Object(core_es5["B" /* Injectable */])(),
    media_service___metadata("design:paramtypes", [ionic_angular["e" /* Platform */], media["a" /* Media */], core_es5["P" /* NgZone */]])
], MediaService);

//# sourceMappingURL=media.service.js.map
// CONCATENATED MODULE: ./src/services/preferences.service.ts
var preferences_service___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var preferences_service___metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var PreferencesService = (function () {
    function PreferencesService(storage) {
        var _this = this;
        this.storage = storage;
        this._preferences = {};
        /* When storage is ready, load all favourites into the app */
        this._ready = new Promise(function (resolve, reject) {
            _this.storage.ready()
                .then(function () {
                _this._preferences = _this.DEFAULT_PREFERENCES;
                return _this.storage.forEach(function (value, key) {
                    if (key.startsWith('preferences:')) {
                        var newKey = key.replace('preferences:', '');
                        _this.getPreferences()[newKey] = value;
                    }
                });
            })
                .then(function () { return resolve(); })
                .catch(function (error) { return reject(error); });
        });
    }
    Object.defineProperty(PreferencesService.prototype, "DEFAULT_PREFERENCES", {
        get: function () {
            return {
                baseUrl: 'https://s3-eu-west-1.amazonaws.com/soundboard-gc',
                soundsFile: '/sounds.json',
                cachingEnabled: true
            };
        },
        enumerable: true,
        configurable: true
    });
    PreferencesService.prototype.ready = function () {
        return this._ready;
    };
    PreferencesService.prototype.resetToDefaults = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            Object.keys(_this.getPreferences()).forEach(function (key) {
                _this.remove(key)
                    .then(function () {
                    if (Object.keys(_this.getPreferences()).length === 0) {
                        _this._preferences = _this.DEFAULT_PREFERENCES;
                        return resolve();
                    }
                })
                    .catch(function (error) { return reject(error); });
            });
        });
    };
    PreferencesService.prototype.exists = function (key) {
        return this.getPreferences().hasOwnProperty(key);
    };
    PreferencesService.prototype.set = function (key, value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            return _this.storage.set('preferences:' + key, value)
                .then(function () {
                _this.getPreferences()[key] = value;
                return resolve(key);
            })
                .catch(function (error) { return reject(error); });
        });
    };
    PreferencesService.prototype.setIfNotAlready = function (key, value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.exists(key)) {
                return resolve();
            }
            return _this.set(key, value);
        });
    };
    PreferencesService.prototype.remove = function (key) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!_this.exists(key)) {
                return reject(key + ' does not exist');
            }
            _this.getPreferences[key] = undefined;
            _this.storage.remove('preferences:' + key)
                .then(function () { return resolve(); })
                .catch(function (error) { return reject(error); });
        });
    };
    PreferencesService.prototype.get = function (key) {
        if (!this.exists(key)) {
            return undefined;
        }
        return this.getPreferences()[key];
    };
    /* Returns all favourites */
    PreferencesService.prototype.getPreferences = function () {
        return this._preferences;
    };
    return PreferencesService;
}());
PreferencesService = preferences_service___decorate([
    Object(core_es5["B" /* Injectable */])(),
    preferences_service___metadata("design:paramtypes", [es2015["b" /* Storage */]])
], PreferencesService);

//# sourceMappingURL=preferences.service.js.map
// CONCATENATED MODULE: ./src/pages/preferences/preferences.ts
var preferences___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var preferences___metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var PreferencesPage = (function () {
    function PreferencesPage(cacheService, preferencesService, viewCtrl) {
        this.cacheService = cacheService;
        this.preferencesService = preferencesService;
        this.viewCtrl = viewCtrl;
        this.cachingEnabled = this.preferencesService.get('cachingEnabled');
    }
    PreferencesPage.prototype.dismiss = function () {
        var _this = this;
        var data = {
            reload: true
        };
        if (this.preferencesService.get('cachingEnabled') && !this.cachingEnabled) {
            this.cacheService.clearCache();
        }
        this.preferencesService.set('cachingEnabled', this.cachingEnabled)
            .then(function () {
            _this.viewCtrl.dismiss(data);
        })
            .catch(function (error) { return console.log(error); });
    };
    return PreferencesPage;
}());
PreferencesPage = preferences___decorate([
    Object(core_es5["n" /* Component */])({template:/*ion-inline-start:"E:\Source\soundboard\gemma-says\src\pages\preferences\preferences.html"*/'<ion-header>\n\n  <ion-navbar>\n\n    <ion-title>\n\n      Preferences\n\n    </ion-title>\n\n    <ion-buttons end>\n\n      <button ion-button (click)="dismiss()">\n\n        <ion-icon name="close" color="dark"></ion-icon>\n\n      </button>\n\n    </ion-buttons>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n  <ion-list>\n\n    <ion-list-header>\n\n      Caching\n\n    </ion-list-header>\n\n    <ion-item>\n\n      <ion-toggle color="dark" [(ngModel)]="cachingEnabled"></ion-toggle>\n\n      <ion-label>\n\n        Enable Local Caching\n\n      </ion-label>\n\n      <ion-icon name="archive" item-start></ion-icon>\n\n    </ion-item>\n\n  </ion-list>\n\n  <button color="dark" (click)="cacheService.clearCache()" ion-button full outline> Clear Local Cache</button>\n\n</ion-content>\n\n'/*ion-inline-end:"E:\Source\soundboard\gemma-says\src\pages\preferences\preferences.html"*/
    }),
    preferences___metadata("design:paramtypes", [CacheService, PreferencesService, ionic_angular["f" /* ViewController */]])
], PreferencesPage);

//# sourceMappingURL=preferences.js.map
// CONCATENATED MODULE: ./src/pages/soundboard/soundboard.ts
var soundboard___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var soundboard___metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var soundboard_SoundboardPage = (function () {
    function SoundboardPage(http, favouritesService, mediaService, cacheService, preferencesService, modalCtrl) {
        var _this = this;
        this.http = http;
        this.favouritesService = favouritesService;
        this.mediaService = mediaService;
        this.cacheService = cacheService;
        this.preferencesService = preferencesService;
        this.modalCtrl = modalCtrl;
        this.title = 'Gemma Says...';
        this.sounds = [];
        this.preferencesService.ready()
            .then(function () { return _this.cacheService.ready(); })
            .then(function () {
            return _this.load();
        })
            .catch(function (error) { return console.log(error); });
    }
    SoundboardPage.prototype.load = function () {
        var _this = this;
        this.cacheService.getCache().forEach(function (cachedSound) {
            cachedSound.isPlaying = false;
            _this.sounds.push(cachedSound);
        });
        return this.getRemoteSounds();
    };
    SoundboardPage.prototype.reload = function () {
        this.sounds = [];
        return this.load();
    };
    /* Gets all sounds found at this.base_url + this.sounds_file */
    SoundboardPage.prototype.getRemoteSounds = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var baseUrl = _this.preferencesService.get('baseUrl');
            var soundsFile = _this.preferencesService.get('soundsFile');
            if (!baseUrl || !soundsFile) {
                return reject('No base url or sounds file specified');
            }
            _this.http.get(baseUrl + soundsFile)
                .subscribe(function (data) {
                /* Loop through data
                  * Format:
                  * [
                  *   {
                  *     "title": "title",
                  *     "file": "file"
                  *   }
                  * ]
                  */
                data.json().forEach(function (sound) {
                    /* Example: http://website.com/soundfile.mp3 */
                    if (!sound.file.startsWith('http')) {
                        if (!sound.file.startsWith('/')) {
                            sound.file = '/' + sound.file;
                        }
                        /* Example: (/)soundfile.mp3 -> http://website.com/soundfile.mp3 */
                        sound.file = baseUrl + sound.file;
                    }
                    /* If the file is not already in the cache or it is, but outdated,
                     * only then does the remote sound get added to the list
                     */
                    if (!_this.cacheService.hasInCache(sound)) {
                        _this.sounds.push({
                            title: sound.title,
                            src: sound.file,
                            isPlaying: false
                        });
                    }
                });
                return resolve();
            }, function (error) { return reject(error); }, function () { return console.log(_this.sounds); });
        });
    };
    /* Plays a sound, pausing other playing sounds if necessary */
    SoundboardPage.prototype.cacheAndPlay = function (sound) {
        var _this = this;
        this.cache(sound).then(function () { return _this.mediaService.play(sound); });
    };
    /* Caches a given sound */
    SoundboardPage.prototype.cache = function (sound) {
        var _this = this;
        /* Adds a sound to the cache, then updates its attributes to reflect its new status */
        return new Promise(function (resolve, reject) {
            if (!window.hasOwnProperty('cordova') || !_this.preferencesService.get('cachingEnabled')) {
                return resolve();
            }
            return _this.cacheService.addToCache(sound)
                .then(function (cachedSound) {
                sound.src = cachedSound.src;
                sound.remoteSrc = cachedSound.remoteSrc;
                sound.cacheDate = cachedSound.cacheDate;
                return resolve();
            })
                .catch(function (error) { return console.log(error); });
        });
    };
    /* Stops the playback of the sound */
    SoundboardPage.prototype.stopPlayback = function () {
        this.mediaService.stopPlayback();
    };
    /* Clears the entire cache, and reloads all remote sounds */
    SoundboardPage.prototype.clearCacheAndReload = function () {
        var _this = this;
        return this.cacheService.clearCache()
            .then(function () { return _this.reload(); })
            .catch(function (error) { return console.log(error); });
    };
    /* Toggle a sound as favourite */
    SoundboardPage.prototype.toggleFavourite = function (sound) {
        return this.favouritesService.toggleFavourite(sound)
            .catch(function (error) { return console.log(error); });
    };
    /* Lists all favourited sounds */
    SoundboardPage.prototype.listFavouriteSounds = function () {
        var _this = this;
        return this.sounds.filter(function (sound) { return _this.favouritesService.hasFavourite(sound); });
    };
    /* Lists all sounds not marked as favourite */
    SoundboardPage.prototype.listRegularSounds = function () {
        var _this = this;
        return this.sounds.filter(function (sound) { return !_this.favouritesService.hasFavourite(sound); });
    };
    /* List all sounds, favourites first */
    SoundboardPage.prototype.listSortedSounds = function () {
        return this.listFavouriteSounds().concat(this.listRegularSounds());
    };
    SoundboardPage.prototype.showPreferences = function () {
        var _this = this;
        var preferencesModal = this.modalCtrl.create(PreferencesPage);
        preferencesModal.onDidDismiss(function (data) {
            if (!data) {
                return;
            }
            if (data.reload) {
                _this.reload();
            }
        });
        preferencesModal.present();
    };
    return SoundboardPage;
}());
soundboard_SoundboardPage = soundboard___decorate([
    Object(core_es5["n" /* Component */])({template:/*ion-inline-start:"E:\Source\soundboard\gemma-says\src\pages\soundboard\soundboard.html"*/'<ion-header>\n\n  <ion-navbar>\n\n    <ion-title>{{ title }}</ion-title>\n\n     <!-- <button ion-button (click)="clearCacheAndReload()">Clear</button> -->\n\n     <ion-buttons end>\n\n        <button (click)="showPreferences()" ion-button icon-only>\n\n          <ion-icon name="more" color="dark"></ion-icon>\n\n        </button>\n\n      </ion-buttons>\n\n    </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n\n\n<ion-list>\n\n  <ion-item detail-none *ngFor="let sound of listSortedSounds()">\n\n    <h2>{{ sound.title }}</h2>\n\n\n\n    <ion-icon *ngIf="!sound.isPlaying" name="play" item-start (click)="cacheAndPlay(sound)"></ion-icon>\n\n    <ion-icon *ngIf="sound.isPlaying" name="square" item-start (click)="stopPlayback()"></ion-icon>\n\n\n\n    <ion-icon *ngIf="!favouritesService.hasFavourite(sound)" name="star-outline" item-end (click)="toggleFavourite(sound)"></ion-icon>\n\n    <ion-icon *ngIf="favouritesService.hasFavourite(sound)" name="star" item-end (click)="toggleFavourite(sound)"></ion-icon>\n\n  </ion-item>\n\n</ion-list>\n\n\n\n</ion-content>\n\n'/*ion-inline-end:"E:\Source\soundboard\gemma-says\src\pages\soundboard\soundboard.html"*/
    }),
    soundboard___metadata("design:paramtypes", [http_es5["a" /* Http */], FavouritesService, MediaService,
        CacheService, PreferencesService,
        ionic_angular["d" /* ModalController */]])
], soundboard_SoundboardPage);

//# sourceMappingURL=soundboard.js.map
// CONCATENATED MODULE: ./src/app/app.component.ts
var app_component___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var app_component___metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var app_component_MyApp = (function () {
    function MyApp(platform, statusBar, splashScreen) {
        this.rootPage = soundboard_SoundboardPage;
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
        });
    }
    return MyApp;
}());
app_component_MyApp = app_component___decorate([
    Object(core_es5["n" /* Component */])({template:/*ion-inline-start:"E:\Source\soundboard\gemma-says\src\app\app.html"*/'<ion-nav [root]="rootPage"></ion-nav>\n\n'/*ion-inline-end:"E:\Source\soundboard\gemma-says\src\app\app.html"*/
    }),
    app_component___metadata("design:paramtypes", [ionic_angular["e" /* Platform */], status_bar["a" /* StatusBar */], splash_screen["a" /* SplashScreen */]])
], app_component_MyApp);

//# sourceMappingURL=app.component.js.map
// CONCATENATED MODULE: ./src/app/app.module.ts
var app_module___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

















var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = app_module___decorate([
    Object(core_es5["L" /* NgModule */])({
        declarations: [
            app_component_MyApp,
            PreferencesPage,
            soundboard_SoundboardPage
        ],
        imports: [
            platform_browser_es5["a" /* BrowserModule */],
            http_es5["b" /* HttpModule */],
            ionic_angular["c" /* IonicModule */].forRoot(app_component_MyApp),
            es2015["a" /* IonicStorageModule */].forRoot()
        ],
        bootstrap: [ionic_angular["a" /* IonicApp */]],
        entryComponents: [
            app_component_MyApp,
            PreferencesPage,
            soundboard_SoundboardPage
        ],
        providers: [
            CacheService,
            FavouritesService,
            MediaService,
            PreferencesService,
            file["a" /* File */],
            file_transfer["a" /* FileTransfer */],
            media["a" /* Media */],
            splash_screen["a" /* SplashScreen */],
            status_bar["a" /* StatusBar */],
            { provide: core_es5["v" /* ErrorHandler */], useClass: ionic_angular["b" /* IonicErrorHandler */] }
        ]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map
// CONCATENATED MODULE: ./src/app/main.ts


Object(platform_browser_dynamic_es5["a" /* platformBrowserDynamic */])().bootstrapModule(AppModule);
//# sourceMappingURL=main.js.map

/***/ })

},[33]);
//# sourceMappingURL=main.js.map