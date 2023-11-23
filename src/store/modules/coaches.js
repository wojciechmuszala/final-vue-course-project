export default {
  namespaced: true,
  state() {
    return {
      coaches: [
        {
          id: "c1",
          firstName: "First",
          lastName: "Coach",
          areas: ["frontend"],
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          hourlyRate: 30,
        },
        {
          id: "c2",
          firstName: "Second",
          lastName: "Trainer",
          areas: ["backend"],
          description:
            "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
          hourlyRate: 30,
        },
      ],
    };
  },
  mutations: {},
  actions: {},
  getters: {
    coaches(state) {
      return state.coaches;
    },
    hasCoaches(state) {
      return state.coaches && state.coaches.length > 0;
    },
  },
};

<template></template>;
