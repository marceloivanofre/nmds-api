const router = require('express').Router();

const passport = require('./config/passport')();
const {
  User,
  Session,
  Token,
  Campus,
  System,
  Provider,
  IP,
  Vlan,
  Vpn,
  Equipment,
  EquipmentActive
} = require('./app/controllers');
const admin = require('./app/middlewares/admin');

// rotas publicas
router.post('/sessions', Session.store);
router.get('/firstAccess', User.firstAccess);
router.post('/firstAccess', User.adminRegister);

router.post('/sessions/validate', Session.index);

router.post('/confirm', Token.confirmAccount);
router.post('/forgot', Token.forgotPassword);
router.post('/reset', Token.resetPassword);

// rotas autenticadas
router.use(passport.authenticate());

router.post('/users', admin(User.store));
router.get('/users/profile', User.show);
router.get('/users', admin(User.index));
router.delete('/users/:id', admin(User.delete));
router.put('/users/:id', User.update);

router.post('/campus', admin(Campus.store));
router.get('/campus', admin(Campus.index));
router.get('/campus/:id', Campus.show);
router.delete('/campus/:id', admin(Campus.delete));
router.put('/campus/:id', admin(Campus.update));

router.get('/log/error', admin(System.logs));
router.get('/system/status', admin(System.status));

router.post('/providers', Provider.store);
router.put('/providers/:id', Provider.update);
router.get('/providers', Provider.index);
router.delete('/providers/:id', Provider.delete);

router.get('/ips', IP.index);
router.put('/ips/:id', IP.update);

router.post('/campus/:id/vlans', Vlan.create);
router.put('/vlans/:id', Vlan.update);
router.get('/campus/:id/vlans', Vlan.getAll);
router.delete('/vlans/:id', Vlan.delete);

router.post('/vpn', admin(Vpn.create));
router.put('/vpn/:id', admin(Vpn.update));
router.delete('/vpn/:id', admin(Vpn.delete));
router.get('/vpn', Vpn.getAll);

router.post('/switchs', admin(Equipment.create));
router.put('/switchs/:id', admin(Equipment.update));
router.delete('/switchs/:id', admin(Equipment.delete));
router.get('/switchs', Equipment.getAll);

router.post('/campus/:id/switchs', EquipmentActive.create);
router.get('/campus/:id/switchs', EquipmentActive.getAll);
router.delete('/switchs/active/:id', EquipmentActive.delete);
router.put('/switchs/active/info/:id', EquipmentActive.update);

router.get('/campus/:id/switchs/:equipmentId', EquipmentActive.get);
router.put('/switchs/active/:id', EquipmentActive.updateDoors);
module.exports = router;
