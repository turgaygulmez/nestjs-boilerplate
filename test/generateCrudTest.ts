export function generateCRUDTests(getController, primaryKey, model) {
  return () => {
    it('should get all items', async () => {
      const controller = getController();
      const items = await controller.getAll();
      expect(items?.length).toBeGreaterThan(0);
    });

    it('should get single item', async () => {
      const controller = getController();
      const items = await controller.getAll();
      const firstItemID = items[0][primaryKey];
      const item = await controller.getById(firstItemID);

      expect(item[primaryKey]).toBe(firstItemID);
    });

    it('should create a new item', async () => {
      const controller = getController();
      await controller.create(model);
      const items = await controller.getAll();

      const item = items.find((x) => x[primaryKey] === null);

      expect(item).toBeTruthy();
    });

    it('should update an existing item', async () => {
      const controller = getController();
      await controller.update(1, model);
      const newItem = await controller.getById(1);

      Object.keys(model).forEach((x) => {
        expect(model[x]).toEqual(newItem[x]);
      });
    });

    it('should delete an existing item', async () => {
      const controller = getController();
      await controller.deleteById(1);
      const item = await controller.getById(1);

      expect(item).toBeFalsy();
    });
  };
}
