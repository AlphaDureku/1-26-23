const model = require("../sequelize_sequelizeModel");
const uuid = require("uuid");
const Sequelize = require("sequelize");
const moment = require("moment");

const doctorAttributes = [
  "doctor_ID",
  "doctor_first_name",
  "doctor_last_name",
  "doctor_gender",
  "doctor_room",
  "doctor_contact_number",
  [Sequelize.fn("group_concat", Sequelize.col("HMO_Name")), "HMO_Name"],
  [Sequelize.col("specialization_Name"), "specialization"],
];

const doctorSchedAttributes = [
  "doctor_ID",
  [
    Sequelize.fn(
      "date_format",
      Sequelize.col("doctor_schedule_date"),
      "%b %e, %Y"
    ),
    "date",
  ],
  [
    Sequelize.fn(
      "date_format",
      Sequelize.col("doctor_schedule_date"),
      "%b %e, %Y"
    ),
    "day",
  ],
  [
    Sequelize.fn(
      "date_format",
      Sequelize.col("doctor_schedule_start_time"),
      "%h:%i%p"
    ),
    "start",
  ],
  [
    Sequelize.fn(
      "date_format",
      Sequelize.col("doctor_schedule_end_time"),
      "%h:%i%p"
    ),
    "end",
  ],
];

const doctorSchedInclude = [
  {
    model: model.doctor_schedule_table,
    required: true,
    attributes: [],
    where: {
      [Sequelize.Op.and]: [
        {
          doctor_schedule_status: "available",
        },
        {
          doctor_schedule_date: {
            [Sequelize.Op.gt]: new Date(),
          },
        },
      ],
    },
    order: [["doctor_schedule_date", "ASC"]],
  },
];

const groupDoctorInfo = [
  "doctor_ID",
  "doctor_first_name",
  "doctor_last_name",
  "doctor_contact_number",
];

const patient_age = Sequelize.fn(
  "TIMESTAMPDIFF",
  Sequelize.literal("YEAR"),
  Sequelize.literal("patient_dateOfBirth"),
  Sequelize.fn("NOW")
);

exports.getOneDoctor = async function (doctor_ID) {
  const oneDayFromNow = Sequelize.literal("CURRENT_DATE + INTERVAL 1 DAY");
  return await model.doctor.findAll({
    raw: true,
    attributes: [
      [
        Sequelize.fn(
          "date_format",
          Sequelize.col("doctor_schedule_date"),
          "%b %e, %Y"
        ),
        "date",
      ],
      [
        Sequelize.fn(
          "date_format",
          Sequelize.col("doctor_schedule_date"),
          "%Y-%m-%d"
        ),
        "date2",
      ],
      [Sequelize.col("doctor_schedule_start_time"), "start"],
      [Sequelize.col("doctor_schedule_end_time"), "end"],
    ],
    include: [
      {
        model: model.doctor_schedule_table,
        required: true,
        attributes: [],
        where: {
          [Sequelize.Op.and]: [
            {
              doctor_schedule_status: "available",
            },
            {
              doctor_schedule_date: {
                [Sequelize.Op.ne]: oneDayFromNow,
                [Sequelize.Op.gt]: new Date(),
              },
            },
          ],
        },
      },
    ],
    where: { doctor_ID: doctor_ID },
  });
};

exports.getOneDoctor2 = async function (doctor_ID) {
  return await model.doctor.findAll({
    raw: true,
    attributes: [
      [Sequelize.col("doctor_schedule_ID"), "doctor_schedule_ID"],
      [
        Sequelize.fn(
          "date_format",
          Sequelize.col("doctor_schedule_date"),
          "%W"
        ),
        "day",
      ],
      [
        Sequelize.fn(
          "date_format",
          Sequelize.col("doctor_schedule_date"),
          "%b %e, %Y"
        ),
        "date",
      ],
      [
        Sequelize.fn(
          "date_format",
          Sequelize.col("doctor_schedule_date"),
          "%Y/%m/%d"
        ),
        "date2",
      ],
      [Sequelize.col("doctor_schedule_max_patient"), "max"],
      [Sequelize.col("doctor_schedule_current_queue"), "current"],
      [Sequelize.col("doctor_schedule_start_time"), "start"],
      [Sequelize.col("doctor_schedule_end_time"), "end"],
      [Sequelize.col("doctor_schedule_Interval"), "Interval"],
    ],
    include: [
      {
        model: model.doctor_schedule_table,
        required: true,
        attributes: [],
        where: {
          doctor_schedule_status: "Available",
        },
      },
    ],
    where: { doctor_ID: doctor_ID },
  });
};

exports.getDoctorUsing_ID = async function (doctor_ID) {
  return await model.doctor.findByPk(doctor_ID, {
    raw: true,
    attributes: [
      "doctor_first_name",
      "doctor_last_name",
      [Sequelize.col("specialization_Name"), "specialization"],
    ],
    include: [
      {
        model: model.doctor_specialization,
      },
    ],
  });
};

//done
exports.getDoctor = async function () {
  return await model.doctor.findAll({
    raw: true,
    attributes: doctorAttributes,
    include: [
      {
        model: model.HMO,
        through: "doctor_HMO_JunctionTable",
        attributes: [],
      },
      {
        model: model.doctor_specialization,
      },
    ],
    group: groupDoctorInfo,
    order: [["doctor_last_name", "ASC"]],
  });
};

exports.getSchedule = async function () {
  const oneDayFromNow = Sequelize.literal("CURRENT_DATE + INTERVAL 1 DAY");
  return await model.doctor.findAll({
    raw: true,
    attributes: doctorSchedAttributes,
    order: [["doctor_first_name", "ASC"]],
    include: doctorSchedInclude,
  });
};

exports.getDoctor_Using_Spec_SubSpec_HMO = async function (searchOption) {
  return await model.doctor.findAll({
    raw: true,
    attributes: doctorAttributes,

    include: [
      {
        model: model.HMO,
        where: [
          {
            [Sequelize.Op.or]: [
              { HMO_ID: searchOption.doctor_HMO },
              {
                "$doctor.doctorSpecializationSpecializationID$":
                  searchOption.Specialization,
              },
            ],
          },
        ],
      },
      {
        model: model.doctor_specialization,
      },
    ],

    order: [["doctor_last_name", "ASC"]],
    group: [
      "doctor_ID",
      "doctor_first_name",
      "doctor_last_name",
      "doctor_contact_number",
    ],
  });
};

exports.getSchedule_Using_Spec_SubSpec_HMO = async function (searchOption) {
  return await model.doctor.findAll({
    raw: true,
    attributes: doctorSchedAttributes,

    include: [
      {
        model: model.HMO,
        where: [
          {
            [Sequelize.Op.or]: [
              { HMO_ID: searchOption.doctor_HMO },
              {
                "$doctor.doctorSpecializationSpecializationID$":
                  searchOption.Specialization,
              },
            ],
          },
        ],
      },
    ],

    include: doctorSchedInclude,
  });
};
exports.getDoctor_Using_All = async function (searchOption) {
  return await model.doctor.findAll({
    raw: true,
    attributes: doctorAttributes,
    include: [
      {
        model: model.HMO,
        where: [
          {
            [Sequelize.Op.and]: [
              { HMO_ID: searchOption.doctor_HMO },
              {
                "$doctor.doctorSpecializationSpecializationID$":
                  searchOption.Specialization,
              },
            ],
          },
        ],
      },
    ],
    order: [["doctor_last_name", "ASC"]],
    group: [
      "doctor_ID",
      "doctor_first_name",
      "doctor_last_name",
      "doctor_contact_number",
    ],

    where: [
      {
        [Sequelize.Op.and]: [
          {
            doctor_first_name: {
              [Sequelize.Op.like]: `%${searchOption.Fname}%`,
            },
            doctor_last_name: {
              [Sequelize.Op.like]: `%${searchOption.Lname}%`,
            },
          },
        ],
      },
    ],
  });
};

exports.getSchedule_Using_All = async function (searchOption) {
  console.log(searchOption);
  return await model.doctor.findAll({
    raw: true,
    attributes: doctorSchedAttributes,
    include: [
      {
        model: model.HMO,
        where: [
          {
            [Sequelize.Op.and]: [
              { HMO_ID: searchOption.doctor_HMO },
              {
                "$doctor.doctorSpecializationSpecializationID$":
                  searchOption.Specialization,
              },
            ],
          },
        ],
      },
    ],
    include: doctorSchedInclude,
    where: [
      {
        [Sequelize.Op.and]: [
          {
            doctor_first_name: {
              [Sequelize.Op.like]: `%${searchOption.Fname}%`,
            },
            doctor_last_name: {
              [Sequelize.Op.like]: `%${searchOption.Lname}%`,
            },
          },
        ],
      },
    ],
  });
};

exports.getDoctor_Using_Fname_Lname = async function (searchOption) {
  return await model.doctor.findAll({
    raw: true,
    attributes: doctorAttributes,
    include: [
      {
        model: model.HMO,
        through: "doctor_HMO_JunctionTable",
        attributes: [],
      },
      {
        model: model.doctor_specialization,
      },
    ],
    order: [["doctor_last_name", "ASC"]],
    group: [
      "doctor_ID",
      "doctor_first_name",
      "doctor_last_name",
      "doctor_contact_number",
    ],
    where: [
      {
        [Sequelize.Op.and]: [
          {
            doctor_first_name: {
              [Sequelize.Op.like]: `%${searchOption.Fname}%`,
            },
            doctor_last_name: {
              [Sequelize.Op.like]: `%${searchOption.Lname}%`,
            },
          },
        ],
      },
    ],
  });
};

exports.getSchedule_Using_Fname_Lname = async function (searchOption) {
  return await model.doctor.findAll({
    raw: true,
    attributes: doctorSchedAttributes,
    include: doctorSchedInclude,
    where: [
      {
        [Sequelize.Op.and]: [
          {
            doctor_first_name: {
              [Sequelize.Op.like]: `%${searchOption.Fname}%`,
            },
            doctor_last_name: {
              [Sequelize.Op.like]: `%${searchOption.Lname}%`,
            },
          },
        ],
      },
    ],
  });
};
exports.getDoctor_Using_Fname = async function (searchOption) {
  return await model.doctor.findAll({
    raw: true,
    attributes: doctorAttributes,
    include: [
      {
        model: model.HMO,
        through: "doctor_HMO_JunctionTable",
        attributes: [],
      },
      {
        model: model.doctor_specialization,
      },
    ],
    order: [["doctor_last_name", "ASC"]],
    group: [
      "doctor_ID",
      "doctor_first_name",
      "doctor_last_name",
      "doctor_contact_number",
    ],
    where: [
      {
        doctor_first_name: {
          [Sequelize.Op.like]: `%${searchOption.Fname}%`,
        },
      },
    ],
  });
};

exports.getSchedule_Using_Fname = async function (searchOption) {
  return await model.doctor.findAll({
    raw: true,
    attributes: doctorSchedAttributes,
    include: doctorSchedInclude,
    where: [
      {
        doctor_first_name: {
          [Sequelize.Op.like]: `%${searchOption.Fname}%`,
        },
      },
    ],
  });
};
exports.getDoctor_Using_Lname = async function (searchOption) {
  return await model.doctor.findAll({
    raw: true,
    attributes: doctorAttributes,
    include: [
      {
        model: model.HMO,
        through: "doctor_HMO_JunctionTable",
        attributes: [],
      },
      {
        model: model.doctor_specialization,
      },
    ],
    order: [["doctor_last_name", "ASC"]],
    group: [
      "doctor_ID",
      "doctor_first_name",
      "doctor_last_name",
      "doctor_contact_number",
    ],
    where: [
      {
        doctor_last_name: {
          [Sequelize.Op.like]: `%${searchOption.Lname}%`,
        },
      },
    ],
  });
};
exports.getSchedule_Using_Lname = async function (searchOption) {
  return await model.doctor.findAll({
    raw: true,
    attributes: doctorSchedAttributes,
    include: doctorSchedInclude,
    where: [
      {
        doctor_last_name: {
          [Sequelize.Op.like]: `%${searchOption.Lname}%`,
        },
      },
    ],
  });
};

exports.getQueueInstance = async function (doctor_schedule_ID) {
  const instance = await model.doctor_schedule_table.findByPk(
    doctor_schedule_ID
  );
  return await instance.get("doctor_schedule_current_queue");
};

exports.incrementQueue = async function (doctor_schedule_ID) {
  await model.doctor_schedule_table.increment("doctor_schedule_current_queue", {
    returning: true,
    by: 1,
    where: { doctor_schedule_ID: doctor_schedule_ID },
  });
  await model.doctor_schedule_table.update(
    {
      doctor_schedule_status: "Unavailable",
    },
    {
      where: {
        doctor_schedule_ID: doctor_schedule_ID,
        doctor_schedule_max_patient: {
          [Sequelize.Op.lt]: Sequelize.col("doctor_schedule_current_queue"),
        },
      },
    }
  );
};

exports.fetchDoctorPatientAppointments = async function (
  doctor_ID,
  startOfWhat,
  endOfWhat
) {
  return await model.appointmentDetails.findAll({
    raw: true,
    attributes: [
      "appointment_ID",
      "patient_ID",
      [Sequelize.col("patient_first_name"), "patient_Fname"],
      [Sequelize.col("patient_last_name"), "patient_Lname"],
      [Sequelize.col("patient_gender"), "gender"],
      [patient_age, "age"],
      [Sequelize.col("patient_contact_number"), "contact"],
      [Sequelize.col("user_email"), "email"],
      [Sequelize.col("doctor_first_name"), "doctor_Fname"],
      [Sequelize.col("doctor_last_name"), "doctor_Lname"],
      [Sequelize.col("doctor_first_name"), "doctor_Fname"],
      [Sequelize.col("specialization_Name"), "specialization"],
      [
        Sequelize.fn(
          "date_format",
          Sequelize.col("appointment_start"),
          "%h:%i%p"
        ),
        "start",
      ],
      [
        Sequelize.fn(
          "date_format",
          Sequelize.col("doctor_schedule_end_time"),
          "%h:%i%p"
        ),
        "end",
      ],
      [
        Sequelize.fn(
          "date_format",
          Sequelize.col("doctor_schedule_date"),
          "%M %e, %Y"
        ),
        "modalDate",
      ],
      [
        Sequelize.fn(
          "date_format",
          Sequelize.col("doctor_schedule_date"),
          "%m/%d/%Y"
        ),
        "appointmentDate",
      ],
      ["appointment_status", "status"],
    ],
    include: [
      {
        model: model.doctor,
        attributes: [],
        include: [
          {
            model: model.doctor_specialization,
            attributes: [],
          },
        ],
      },
      {
        model: model.patient,
        attributes: [],
        required: true,
        include: [
          {
            model: model.user,
            attributes: [],
          },
        ],
      },
      {
        model: model.doctor_schedule_table,
        attributes: [],
      },
    ],
    where: {
      doctor_ID: doctor_ID,
      createdAt: {
        [Sequelize.Op.between]: [startOfWhat, endOfWhat],
      },
    },
  });
};

exports.fetchDoctorPatientAppointmentsWithName = async function (
  doctor_ID,
  startOfWhat,
  endOfWhat,
  query
) {
  return await model.appointmentDetails.findAll({
    raw: true,
    attributes: [
      "appointment_ID",
      "patient_ID",
      [Sequelize.col("patient_first_name"), "patient_Fname"],
      [Sequelize.col("patient_last_name"), "patient_Lname"],
      [Sequelize.col("patient_gender"), "gender"],
      [patient_age, "age"],
      [Sequelize.col("patient_contact_number"), "contact"],
      [Sequelize.col("user_email"), "email"],
      [Sequelize.col("doctor_first_name"), "doctor_Fname"],
      [Sequelize.col("doctor_last_name"), "doctor_Lname"],
      [Sequelize.col("doctor_first_name"), "doctor_Fname"],
      [Sequelize.col("specialization_Name"), "specialization"],
      [
        Sequelize.fn(
          "date_format",
          Sequelize.col("appointment_start"),
          "%h:%i%p"
        ),
        "start",
      ],
      [
        Sequelize.fn(
          "date_format",
          Sequelize.col("doctor_schedule_end_time"),
          "%h:%i%p"
        ),
        "end",
      ],
      [
        Sequelize.fn(
          "date_format",
          Sequelize.col("doctor_schedule_date"),
          "%M %e, %Y"
        ),
        "modalDate",
      ],
      [
        Sequelize.fn(
          "date_format",
          Sequelize.col("doctor_schedule_date"),
          "%m/%d/%Y"
        ),
        "appointmentDate",
      ],
      ["appointment_status", "status"],
    ],
    include: [
      {
        model: model.doctor,
        attributes: [],
        include: [
          {
            model: model.doctor_specialization,
            attributes: [],
          },
        ],
      },
      {
        model: model.patient,
        attributes: [],
        include: [
          {
            model: model.user,
            attributes: [],
          },
        ],
        where: [
          {
            [Sequelize.Op.or]: [
              {
                patient_first_name: {
                  [Sequelize.Op.like]: `%${query}%`,
                },
              },
              {
                patient_last_name: {
                  [Sequelize.Op.like]: `%${query}%`,
                },
              },
            ],
          },
        ],
      },
      {
        model: model.doctor_schedule_table,
        attributes: [],
      },
    ],
    where: {
      doctor_ID: doctor_ID,
      createdAt: {
        [Sequelize.Op.between]: [startOfWhat, endOfWhat],
      },
    },
  });
};

exports.fetchDoctorPatientAppointmentsThatDate = async function (
  doctor_ID,
  day
) {
  return await model.appointmentDetails.findAll({
    raw: true,
    attributes: [
      "appointment_ID",
      "patient_ID",
      [Sequelize.col("patient_first_name"), "patient_Fname"],
      [Sequelize.col("patient_last_name"), "patient_Lname"],
      [Sequelize.col("patient_contact_number"), "contact"],
      [
        Sequelize.fn(
          "date_format",
          Sequelize.col("doctor_schedule_date"),
          "%m/%d/%Y"
        ),
        "appointmentDate",
      ],
      [
        Sequelize.fn(
          "date_format",
          Sequelize.col("appointment_start"),
          "%h:%i%p"
        ),
        "start",
      ],
      [
        Sequelize.fn(
          "date_format",
          Sequelize.col("doctor_schedule_end_time"),
          "%h:%i%p"
        ),
        "end",
      ],
    ],
    include: [
      {
        model: model.doctor,
        attributes: [],
        include: [
          {
            model: model.doctor_specialization,
            attributes: [],
          },
        ],
      },
      {
        model: model.patient,
        attributes: [],
        include: [
          {
            model: model.user,
            attributes: [],
          },
        ],
      },
      {
        model: model.doctor_schedule_table,
        attributes: [],
        where: {
          doctor_schedule_date: day,
        },
      },
    ],
    where: {
      doctor_ID: doctor_ID,
      appointment_status: "Confirmed",
    },
  });
};
exports.getOneDoctor3 = async function (doctor_ID) {
  return await model.doctor.findAll({
    raw: true,
    attributes: [
      "doctor_first_name",
      "doctor_last_name",
      [
        Sequelize.fn(
          "date_format",
          Sequelize.col("doctor_schedule_date"),
          "%b %e, %Y"
        ),
        "date",
      ],
      [
        Sequelize.fn(
          "date_format",
          Sequelize.col("doctor_schedule_date"),
          "%Y-%m-%d"
        ),
        "date2",
      ],
      [Sequelize.col("doctor_schedule_start_time"), "start"],
      [Sequelize.col("doctor_schedule_end_time"), "end"],
    ],
    include: [
      {
        model: model.doctor_schedule_table,
        required: true,
        attributes: [],
      },
    ],
    where: { doctor_ID: doctor_ID },
  });
};
exports.getDoctorContact = async function (ID) {
  return await model.doctor.findOne({
    raw: true,
    attributes: [["doctor_email", "email"], "doctor_last_name"],
    where: {
      doctor_ID: ID,
    },
  });
};

exports.checkIfConflict = async function (patient_ID, date) {
  return await model.appointmentDetails.findAll({
    raw: true,
    where: {
      [Sequelize.Op.and]: [
        { patient_ID: patient_ID },
        {
          [Sequelize.Op.or]: [
            { appointment_status: "Confirmed" },
            { appointment_status: "Pending" },
          ],
        },
      ],
    },
    include: [
      {
        model: model.doctor_schedule_table,
        where: {
          doctor_schedule_date: date,
        },
      },
    ],
  });
};

/*
exports.selectDoctorAndSched = async function(doctor_ID) {
    return await model.doctor.findAll({
        raw: true,
        attributes: [
            'doctor_first_name',
            'doctor_last_name',
            'doctor_specialization',
            'doctor_HMO', [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_date'), '%b %e, %Y'), 'date'],
            [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_date'), '%b %e, %Y'), 'day'],
            [Sequelize.col('doctor_schedule_start_time'), 'start'],
            [Sequelize.col('doctor_schedule_end_time'), 'end'],

        ],
        order: [
            ['doctor_first_name', 'ASC']
        ],
        include: [{
            model: model.doctor_schedule_table,
            required: true,
            attributes: []
        }],
    })
}
*/
