import faker from 'faker';

const TestHelper = {
  adminRole: {
    title: 'admin'
  },

  regularRole: {
    title: 'regular'
  },

  roleParams: {
    title: 'cool admin'
  },

  testType1: {
    title: 'note'
  },

  testType2: {
    title: 'confidential'
  },

  testType3: {
    title: 'quotes'
  },

  testUser1: {
    firstname: 'Raphael',
    lastname: 'Akpan',
    email: 'raphael.akpan@andela.com',
    password: 'IamRaphael',
    roleId: 1
  },

  testUser2: {
    firstname: 'Ngozi',
    lastname: 'Ekekwe',
    email: 'ngozi.ekekwe@andela.com',
    password: 'IamNgozi',
    roleId: 2
  },

  invalidUser: {
    FirstName: faker.name.firstName(),
    LastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password()
  },

  testUser3: {
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    roleId: 2
  },

  testUser4: {
    firstname: 'Uyiosa',
    lastname: 'Enabulele',
    email: 'uyiosa.enabulele@andela.com',
    password: 'IamUyiosa',
    roleId: 2
  },

  testDocument1: {
    title: 'About Andela',
    content: 'Andela extends engineering teams with world-class software'
      + ' developers. We recruit the most talented developers on the '
      + 'African continent, shape them into technical leaders, and place '
      + 'them as full-time distributed team members with companies that '
      + 'range from Microsoft and IBM to dozens of high-growth startups',
    access: 'public',
    ownerId: 3,
    typeId: 1
  },

  testDocument2: {
    title: 'Essential quality',
    content: 'The assumption of risk in anticipation of gain but recognizing'
    + ' a higher than average possibility of loss. The term "speculation" '
    + 'implies that a business or investment risk can be analyzed and measured'
    + ', and its distinction from the term "investment" is one of degree of '
    + 'risk. It differs from gambling, which is based on random outcomes'
    + 'Investors can include stock traders but with this distinguishing '
    + 'characteristic: investors are owners of a company which entails '
    + 'responsibilities.',
    access: 'private',
    ownerId: 2,
    typeId: 2
  },

  testDocument3: {
    title: 'Autocannibalism',
    content: 'Many species across the animal kingdom are cannibals, eating'
    + 'members of their own species for sustenance or dominance. But there '
    + 'is one behaviour that is even more extreme than simple cannibalism. '
    + 'Some animals will, on occasion, eat parts of their own bodies. '
    + 'This weird behaviour is known as "autocannibalism"',
    access: 'public',
    ownerId: 3,
    typeId: 2
  },

  testDocument4: {
    title: faker.commerce.department(),
    content: faker.lorem.paragraph(),
    access: 'private',
    ownerId: 3,
    typeId: 1
  },

  testDocument5: {
    title: faker.company.catchPhrase(),
    content: faker.lorem.paragraph(),
    access: 'public',
    ownerId: 2,
    typeId: 2
  },

  invalidDocument: {
    theTitle: faker.company.catchPhrase(),
    content: faker.lorem.paragraph(),
    rightAccess: 'private',
    ownerId: 3,
    typeId: 2
  },

  testDocument6: {
    title: 'Computer Science',
    content: 'Computer Science is the study of the theory, experimentation, '
      + 'and engineering that form the basis for the design and use of '
      + 'computers. It is the scientific and practical approach to computation'
      + ' and its applications and the systematic study of the feasibility, '
      + 'structure, expression, and mechanization of the methodical procedures'
      + ' (or algorithms) that underlie the acquisition, representation, '
      + 'processing, storage, communication of, and access to information',
    access: 'public',
    ownerId: 2,
    typeId: 1
  },

  testDocument7: {
    title: 'E-commerce',
    content: 'This is the buying and selling of goods and services, or '
      + 'the transmitting of funds or data, over an electronic network, '
      + 'primarily the internet. These business transactions occur either '
      + 'as business-to-business, business-to-consumer, consumer-to-consumer '
      + 'or consumer-to-business.',
    access: 'private',
    ownerId: 3,
    typeId: 1
  },

  testDocument8: {
    title: faker.commerce.department(),
    content: faker.lorem.paragraph(),
    access: 'public',
    ownerId: 2,
    typeId: 2
  },
};

export default TestHelper;
