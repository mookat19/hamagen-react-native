import SQLite from 'react-native-sqlite-storage';
import config from '../config/config';

SQLite.enablePromise(true);

const database_name = 'Reactoffline.db';
const database_version = '1.0';
const database_displayname = 'SQLite React Offline Database';
const database_size = 10000000;

export class UserLocationsDatabase {
  initDB() {
    let db;
    return new Promise((resolve, reject) => {
      SQLite.echoTest()
        .then(() => {
          SQLite.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size,
          )
            .then((DB) => {
              db = DB;
              db.executeSql(
                'CREATE TABLE IF NOT EXISTS Samples (lat,long,accuracy,startTime,endTime,geoHash,wifiHash,hash);',
              )
                .then(() => {
                  resolve(db);
                })
                .catch((error) => {
                  reject(error);
                });
            })
            .catch((error) => {
              console.log(error);
              reject(error);
            });
        })
        .catch((error) => {
          console.log('echoTest failed - plugin not functional');
          reject(error);
        });
    });
  }

  closeDatabase(db) {
    if (db) {
      db.close().catch((error) => {
        console.log(error);
        // this.errorCB(error);
        // TODO makes unhandled promise reject in addSample function - need to check why
        //
      });
    }
  }

  listSamples() {
    return new Promise((resolve) => {
      this.initDB()
        .then((db) => {
          db.transaction((tx) => {
            tx.executeSql('SELECT * FROM Samples', []).then(([, results]) => {
              const samples = [];
              const len = results.rows.length;
              for (let i = 0; i < len; i++) {
                const row = results.rows.item(i);
                samples.push(row);
              }
              resolve(samples);
            });
          })
            .then(() => {
              this.closeDatabase(db);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  updateLastSampleEndTime(endTime) {
    return new Promise((resolve) => {
      this.initDB()
        .then((db) => {
          db.transaction((tx) => {
            tx.executeSql(
              `UPDATE Samples set endTime=${endTime} WHERE rowid=(SELECT MAX(rowid) from Samples)`,
            ).then(([, results]) => {
              if (results.rows.length > 0) {
                const row = results.rows.item(0);
                resolve(row);
              } else {
                resolve(null);
              }
            });
          })
            .then(() => {
              this.closeDatabase(db);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  addSample(sample) {
    return new Promise((resolve) => {
      this.initDB()
        .then((db) => {
          db.transaction((tx) => {
            tx.executeSql('INSERT INTO Samples VALUES (?,?,?,?,?,?,?,?)', [
              sample.lat,
              sample.long,
              sample.accuracy,
              sample.startTime,
              sample.endTime,
              sample.geoHash,
              sample.wifiHash,
              sample.hash,
            ]).then(([, results]) => {
              resolve(results);
            });
          })
            .then(() => {
              this.closeDatabase(db);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }
}

export class IntersectionSickDatabase {
  initDB() {
    let db;
    return new Promise((resolve, reject) => {
      SQLite.echoTest()
        .then(() => {
          SQLite.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size,
          ).then((DB) => {
            db = DB;
            db.executeSql(
              'CREATE TABLE IF NOT EXISTS IntersectingSick (OBJECTID,Name,Place,Comments,fromTime,toTime,long,lat);',
            )
              .then(() => {
                resolve(db);
              })
              .catch((error) => {
                console.log(error);
                reject(error);
              });
          });
        })
        .catch((error) => {
          console.log(error);
          console.log('echoTest failed - plugin not functional');
        });
    });
  }

  clearDatabase() {
    return new Promise((resolve) => {
      this.initDB()
        .then((db) => {
          db.transaction((tx) => {
            tx.executeSql('DELETE FROM IntersectingSick', []).then(
              ([, results]) => {
                const IntersectingSick = [];
                const len = results.rows.length;
                for (let i = 0; i < len; i++) {
                  const row = results.rows.item(i);
                  IntersectingSick.push(row);
                }
                resolve(IntersectingSick);
              },
            );
          })
            .then(() => {
              this.closeDatabase(db);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  closeDatabase(db) {
    if (db) {
      db.close().catch((error) => {
        console.log(error);
        // this.errorCB(error);
        // TODO makes unhandled promise reject in addSample function - need to check why
      });
    }
  }

  listAllRecords() {
    return new Promise((resolve) => {
      this.initDB()
        .then((db) => {
          db.transaction((tx) => {
            tx.executeSql('SELECT * FROM IntersectingSick', []).then(
              ([, results]) => {
                const IntersectingSick = [];
                const len = results.rows.length;
                for (let i = 0; i < len; i++) {
                  const row = results.rows.item(i);
                  IntersectingSick.push(row);
                }
                resolve(IntersectingSick);
              },
            );
          })
            .then(() => {
              this.closeDatabase(db);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  containsObjectID(OBJECTID) {
    return new Promise((resolve) => {
      this.initDB()
        .then((db) => {
          db.transaction((tx) => {
            tx.executeSql(
              `SELECT * FROM IntersectingSick WHERE OBJECTID =${OBJECTID}`,
            ).then(([, results]) => {
              resolve(results.rows.length > 0);
            });
          })
            .then(() => {
              this.closeDatabase(db);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  addSickRecord(record) {
    return new Promise((resolve) => {
      this.initDB()
        .then((db) => {
          db.transaction((tx) => {
            tx.executeSql(
              'INSERT INTO IntersectingSick VALUES (?,?,?,?,?,?,?,?)',
              [
                record.properties.OBJECTID,
                record.properties.Name,
                record.properties.Place,
                record.properties.Comments,
                record.properties.fromTime,
                record.properties.toTime,
                record.geometry.coordinates[config().sickGeometryLongIndex],
                record.geometry.coordinates[config().sickGeometryLatIndex],
              ],
            ).then(([, results]) => {
              resolve(results);
            });
          })
            .then(() => {
              this.closeDatabase(db);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }
}

export class WifiMacAddressDatabase {
  initDB() {
    let db;
    return new Promise((resolve, reject) => {
      SQLite.echoTest()
        .then(() => {
          SQLite.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size,
          ).then((DB) => {
            db = DB;
            db.executeSql(
              'CREATE TABLE IF NOT EXISTS wifiTable (wifiHash, wifiList);',
            )
              .then(() => {
                resolve(db);
              })
              .catch((error) => {
                console.log(error);
                reject(error);
              });
          });
        })
        .catch((error) => {
          console.log(error);
        })
        .catch((error) => {
          console.log(error);
          console.log('echoTest failed - plugin not functional');
        });
    });
  }

  closeDatabase(db) {
    if (db) {
      db.close().catch((error) => {
        console.log(error);
        // this.errorCB(error);
        // TODO makes unhandled promise reject in addSample function - need to check why
      });
    }
  }

  listAllRecords() {
    return new Promise((resolve) => {
      this.initDB()
        .then((db) => {
          db.transaction((tx) => {
            tx.executeSql('SELECT * FROM wifiTable', []).then(([, results]) => {
              const IntersectingSick = [];
              const len = results.rows.length;
              for (let i = 0; i < len; i++) {
                const row = results.rows.item(i);
                IntersectingSick.push(row);
              }
              resolve(IntersectingSick);
            });
          })
            .then(() => {
              this.closeDatabase(db);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  addWifiMacAddresses(record) {
    return new Promise((resolve) => {
      this.initDB()
        .then((db) => {
          db.transaction((tx) => {
            tx.executeSql('INSERT INTO wifiTable VALUES (?,?)', [
              record.wifiHash,
              record.wifiList,
            ]).then(([, results]) => {
              resolve(results);
            });
          })
            .then(() => {
              this.closeDatabase(db);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  containsWifiHash(wifiHash) {
    return new Promise((resolve) => {
      this.initDB()
        .then((db) => {
          db.transaction((tx) => {
            tx.executeSql('SELECT * FROM wifiTable WHERE wifiHash = ?', [
              wifiHash,
            ]).then(([, results]) => {
              resolve(results.rows.length > 0);
            });
          })
            .then(() => {
              this.closeDatabase(db);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }
}
