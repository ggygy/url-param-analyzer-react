interface ABTestItem {
  experimentName: string;
  result: string;
  sectionId: string;
}

export const getABTestData = (): Promise<ABTestItem[]> => {
  return new Promise((resolve) => {
    const element = document.getElementById('ab_testing_tracker');
    if (!element || !element.getAttribute('value')) {
      resolve([]);
      return;
    }

    const value = element.getAttribute('value')?.replace(/;+$/, '') || '';
    const items = value.split(';').map(item => {
      const [sectionInfo, experimentInfo] = item.split(',');
      const [sectionPrefix, sectionId] = sectionInfo.split(':');
      const [experimentName, result] = experimentInfo.split(':');
      
      return {
        sectionId: sectionId,
        experimentName: experimentName,
        result: result
      };
    });

    resolve(items);
  });
};

