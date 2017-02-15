import faker from 'faker';

const testHelper = {
  adminRole: {
    title: 'admin'
  },

  regularRole: {
    title: 'regular'
  },

  testUser1: {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    roleId: 1
  },

  testUser2: {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    roleId: 2
  },

  testUser3: {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password()
  },

  testDocument1: {
    title: faker.company.catchPhrase(),
    content: faker.lorem.paragraph(),
    access: 'public'
  },

  testDocument2: {
    title: faker.finance.accountName(),
    content: faker.lorem.paragraph(),
    access: 'private'
  },

  testDocument3: {
    title: faker.commerce.department(),
    content: faker.lorem.paragraph(),
    access: 'public'
  },

  documentsCollection() {
    const documentsParams = [];

    for (let i = 0; i < 10; i = i + 1) {
      documentsParams.push({
        title: faker.company.catchPhrase(),
        content: faker.lorem.paragraph(),
        access: (i % 2 == 0) ? 'public' : 'private',
        ownerId: 1
      });
    }

    return documentsParams;
  }
};

export default testHelper;
