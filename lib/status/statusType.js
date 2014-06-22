var Type = function (id, name) {
  this.id = id;
  this.name = name;

  this.getId = function () {
    return this.id;
  };

  this.getName = function () {
    return this.name;
  };

};

var StatusType = {
  UNKNOWN: new Type(0, 'unknown'),
  QUEUED: new Type(1, 'queued'),
  PROCESSING: new Type(2, 'processing'),
  UPTODATE: new Type(3, 'uptodate'),
  NOTSOUPTODATE: new Type(4, 'notsouptodate'),
  OUTOFDATE: new Type(5, 'outofdate')
};

StatusType.fromId = function (id) {
  switch (~~id) {
    case 1 :
      return StatusType.QUEUED;
    case 2 :
      return StatusType.PROCESSING;
    case 3 :
      return StatusType.UPTODATE;
    case 4 :
      return StatusType.NOTSOUPTODATE;
    case 5 :
      return StatusType.OUTOFDATE;
    default:
      return StatusType.UNKNOWN;
  }
};

module.exports.StatusType = StatusType;