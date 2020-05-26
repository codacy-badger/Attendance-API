const express = require('express');
const mongoose = require('mongoose');
const Users = require('../models/user');
const Tasks = require('../models/task');
const Modules = require('../models/modules');
const url = require('url');

exports.createModule = (req, res, next) => {
    const adminId = req.userId;

    Users.findById(adminId)
        .then(success => {
            if (success == null || success.length < 1) {
                return res.status(404).json({
                    success: "false",
                    message: 'Admin Not found'
                })
            } else {
                if (success.role == 'admin') {
                    const module = new Modules();
                    module._id = new mongoose.Types.ObjectId();
                    module.name = req.body.name;
                    if (req.body.task != null) {
                        module._task = req.body.task;
                    }
                    if (req.body.project != null) {
                        module._project = req.body.project;
                    }


                    module.save()
                        .then(result => {
                            console.log(result);
                            return res.status(201).json({
                                success: "true",
                                message: "Module successfully created",
                                moduleId: result._id
                            })
                        })
                        .catch(err => {
                            console.log(err);
                            return res.status(500).json({
                                success: "false",
                                message: "Some error Occurred"
                            });
                        });
                } else {
                    return res.status(401).json({
                        success: 'false',
                        message: 'User not Authorized'
                    })
                }

            }
        })
        .catch(err => {
            return res.status(500).json({
                success: "false",
                message: "Some error occurred"
            })
        })
}


exports.editModule = (req, res, next) => {
    const adminId = req.userId;
    const moduleId = req.params.moduleId;
    Users.findById(adminId)
        .then(success => {
            if (success == null || success.length < 1) {
                return res.status(404).json({
                    success: "false",
                    message: 'Admin Not found'
                })
            } else {
                if (success.role == 'admin') {
                    Modules.findById(moduleId)
                        .then(result => {
                            if (result == null || result.length < 1) {
                                return res.status(404).json({
                                    success: 'false',
                                    message: 'Module not found'
                                })
                            } else {
                                if (req.body.name != null) {
                                    result.name = req.body.name;
                                }
                                if (req.body.task != null) {
                                    result._task = req.body.task;
                                }
                                if (req.body.project != null) {
                                    result._project = req.body.project;
                                }


                                result.save()
                                    .then(result1 => {
                                        return res.status(200).json({
                                            success: 'true',
                                            message: 'Module successfully updated'
                                        })
                                    })
                                    .catch(error1 => {
                                        return res.status(500).json({
                                            success: 'false',
                                            message: 'Some error occurred'
                                        })
                                    })
                            }
                        })
                        .catch(err => {
                            return res.status(500).json({
                                success: 'false',
                                message: 'Some error occurred'
                            })
                        })
                } else {
                    return res.status(401).json({
                        success: 'false',
                        message: 'Unauthorized'
                    })
                }
            }
        })
        .catch(err => {
            return res.status(500).json({
                success: 'false',
                message: 'Some error has occurred'
            })
        })

}


exports.deleteModule = (req, res, next) => {

    const adminId = req.userId;
    const moduleId = req.params.moduleId;

    Users.findById(adminId)
        .then(success => {
            if (success == null || success.length < 1) {
                return res.status(404).json({
                    success: "false",
                    message: 'Admin Not found'
                })
            } else {
                if (success.role == 'admin') {
                    Modules.findById(moduleId)
                        .then(result => {
                            if (result == null || result.length < 1) {
                                return res.status(404).json({
                                    success: 'false',
                                    message: 'Module not found'
                                })
                            } else {
                                Modules.findByIdAndDelete(moduleId)
                                    .then(result1 => {
                                        return res.status(200).json({
                                            success: 'true',
                                            message: 'Module successfully deleted'
                                        })
                                    })
                                    .catch(error1 => {
                                        return res.status(500).json({
                                            success: 'false',
                                            message: 'Some error occurred'
                                        })
                                    })
                            }
                        })
                        .catch(err => {
                            return res.status(500).json({
                                success: 'false',
                                message: 'Some error occurred'
                            })
                        })
                } else {
                    return res.status(401).json({
                        success: 'false',
                        message: 'Unauthorized'
                    })
                }
            }
        })
        .catch(err => {
            return res.status(500).json({
                success: 'false',
                message: 'Some error has occurred'
            })
        })
}

exports.getProjects = (req, res, next) => {
    const userId = req.userId;
    const projectId = req.params.projectId;
    Users.findById(userId)
        .then(success => {
            if (success == null || success.length < 1) {
                return res.status(404).json({
                    success: "false",
                    message: 'User Not found'
                })
            } else {
                Modules.find({ _user: userId, _project: projectId })
                    .then(result => {
                        if (result == null || result.length < 1) {
                            return res.status(404).json({
                                success: 'false',
                                message: 'Project not found'
                            })
                        } else {
                            return res.status(200).json({
                                success: 'true',
                                message: 'Project Found',
                                project: result
                            })

                        }
                    })
                    .catch(err => {
                        return res.status(500).json({
                            success: 'false',
                            message: 'Some error occurred'
                        })
                    })

            }
        })
        .catch(err => {
            return res.status(500).json({
                success: 'false',
                message: 'Some error has occurred'
            })
        })

}