var StatusType = function StatusType(id, name) {
  this.id = id;
  this.name = name;

  this.getId = function () {
    return this.id;
  };

  this.getName = function () {
    return this.name;
  };
};

StatusType.Type = {
  UNKNOWN: new StatusType(0, 'unknown'),
  QUEUED: new StatusType(1, 'queued'),
  PROCESSING: new StatusType(2, 'processing'),
  UPTODATE: new StatusType(3, 'uptodate'),
  NOTSOUPTODATE: new StatusType(4, 'notsouptodate'),
  OUTOFDATE: new StatusType(5, 'outofdate'),
  NOT_SUPPORTED: new StatusType(6, 'notsupported'),
  fromId: function (id) {
    switch (~~id) {
      case 1 :
        return StatusType.Type.QUEUED;
      case 2 :
        return StatusType.Type.PROCESSING;
      case 3 :
        return StatusType.Type.UPTODATE;
      case 4 :
        return StatusType.Type.NOTSOUPTODATE;
      case 5 :
        return StatusType.Type.OUTOFDATE;
      case 6 :
        return StatusType.Type.NOT_SUPPORTED;
      default:
        return StatusType.Type.UNKNOWN;
    }
  }
};

module.exports.StatusType = StatusType;