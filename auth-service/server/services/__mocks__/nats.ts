export const natsService = {
  client: {
    publish: jest
      .fn()
      .mockImplementation(
        (subject: string, data: any, callback: () => void) => {
          callback()
        }
      ),
  },
}
