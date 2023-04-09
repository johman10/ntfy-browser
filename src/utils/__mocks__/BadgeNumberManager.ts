import { BadgeNumberManagerInterface } from "../BadgeNumberManager";

export default class MockBadgeNumberManager
  implements BadgeNumberManagerInterface
{
  reset = jest.fn();
  lower = jest.fn();
  higher = jest.fn();
}
